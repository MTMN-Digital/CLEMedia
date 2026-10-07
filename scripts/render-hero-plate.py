#!/usr/bin/env python3
"""Hero plate: the garden model on a studio sweep, one softbox, in three layers.

  blender -b -P scripts/render-hero-plate.py -- \
      --out /tmp/plate.png --width 1280 --samples 48 --layer back

THE LAYERS EXIST SO THE HERO CAN PARALLAX. One flat photograph scaled up is a
zoom, not a camera move: depth is the DIFFERENCE in rate between near and far,
so the picture has to arrive in pieces. `back` is the room with the garden
lifted out of it, `mid` is the board and its planting, `fore` is the spill on
the floor, and the last two carry alpha.

Each layer hides the other objects FROM THE CAMERA ONLY, never deletes them, so
the garden still throws its shadow across the sweep in the back plate and still
bounces green into the floor. Deleting them instead gives three images that
cannot be recomposited into the shot they came from.

Everything that is a decision is a named constant below. Units are metres,
the floor is z = 0, the garden board is centred on the origin, the camera
looks along +Y.
"""

from __future__ import annotations

import argparse
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

# ---------------------------------------------------------------------------
# ART DIRECTION
# ---------------------------------------------------------------------------
RANDOM_SEED = 7

# Frame. 16:9 so a 92svh desktop viewport crops only a few percent.
FRAME_ASPECT = 16 / 9

# Camera. Low tripod, long lens, almost level: the garden flattens into a
# strip and the sweep's floor seam hides behind it.
# Low, and looking UP: the lens sits below the top of the planting, so the bed
# is met at its own height rather than surveyed from above, the floor
# compresses to a sliver instead of a third of the frame, and the sweep rises
# behind the mark. The old setup was 0.42 m pitched 2.3 degrees DOWN, which is
# a person standing over a model, and it read as a strip of grass on a table.
CAMERA_DISTANCE = 4.2           # metres back from the board centre
CAMERA_HEIGHT = 0.17            # metres above the floor
CAMERA_PITCH_DEG = 2.6          # positive looks up
CAMERA_LENS_MM = 85.0
CAMERA_SENSOR_MM = 36.0
CAMERA_F_STOP = 2.8
CAMERA_FOCUS_Y = 0.0            # focus on the board centre line

# The sweep: one roll of seamless paper, floor into cove into wall.
SWEEP_HALF_WIDTH = 8.0
SWEEP_FLOOR_FRONT_Y = -7.0
SWEEP_COVE_START_Y = 1.6
SWEEP_COVE_RADIUS = 0.9
SWEEP_WALL_HEIGHT = 4.0
SWEEP_ALBEDO = (0.72, 0.61, 0.33, 1.0)   # linear; roughly sRGB 0.87 0.81 0.61
SWEEP_ROUGHNESS = 0.85
SWEEP_TOOTH = 0.04                        # paper grain bump strength

# The garden board: a model base, plywood, standing on the floor.
BOARD_WIDTH = 2.6
BOARD_DEPTH = 1.15              # a bed with rows behind rows, not a trough
BOARD_THICKNESS = 0.036
BOARD_BEVEL = 0.002
SOIL_INSET = 0.0                # flush with the board edge, like a scenic layer
SOIL_THICKNESS = 0.012
SOIL_CRUMBLE = 0.010            # displacement so the soil edge is not a ruled line
SOIL_ALBEDO = (0.045, 0.028, 0.015, 1.0)

# Plants at model scale. The kits are real scale, so a 0.33 m grass tuft at
# 0.36 becomes a 0.12 m model tuft.
# Scales are roughly tripled from the first pass. At the old size the planting
# stood 0.15 m in a one-metre frame, which is why it read as "some random
# grass": a bank has to own the bottom of the picture to be a bank.
GRASS_COUNT = 1150
GRASS_SCALE = (0.70, 1.12)   # the seed heads silhouette dark; keep them short
FERN_COUNT = 95                 # fern_02 is a hart's-tongue: broad straps, good mass
FERN_SCALE = (0.62, 1.05)
CELANDINE_COUNT = 16
CELANDINE_SCALE = (0.55, 0.92)
BRANCH_COUNT = 14
BRANCH_SCALE = (0.32, 0.58)
BOULDER_COUNT = 1
BOULDER_SCALE = (0.06, 0.08)
BOULDER_VALUE = 0.55            # the scan is a pale sandstone; darken it to a garden stone
BOULDER_SATURATION = 0.6
PLANT_FRONT_MARGIN = 0.04       # bare soil between the plants and the front edge
BACK_DENSITY_BIAS = 1.2         # > 1 crowds plants toward the back row

# The bank's silhouette. Plants grow taller toward the frame edges and thin out
# across the middle, so the planting curves up around the mark instead of
# running flat across under it. The dip is what gives the mark somewhere to
# hang; a level hedge would cut the picture in half.
BANK_RISE = 0.80                # extra scale at the edges, over the centre
BANK_DIP = 0.46                 # width of the quiet centre, as a fraction of half-width
BANK_PROFILE = 1.7              # how abruptly the bank climbs out of the dip
# The centre is actively held DOWN, not merely left unraised. The mark hangs
# into this gap, and a bank that only rises at the edges still runs level
# underneath it, which is the hedge the first version of this was.
BANK_CENTRE_DROP = 0.42         # scale at dead centre, easing back to 1 at the dip edge
BANK_BREAK = 0.22               # slow variation along the bank, so the top is not an arc
# Asymmetry. The copy arrives right of centre, so the right side stays lower
# and sparser and the weight sits left. Nothing here is a scrim behind the
# words: the words land on a part of the set that was built to be quiet.
PLANT_LEFT_BIAS = 0.34          # share of plants pushed toward the left half
RIGHT_DROP = 0.22               # how much shorter the right side runs

# The spill: what fell off the model onto the clean floor.
# The foreground is its own parallax plane, so it needs enough on it to read
# as near. At SPILL_DEPTH 0.30 the debris all sat within a few centimetres of
# the board and moved with it; at 0.85 it reaches most of the way to the lens,
# lands lower and larger in frame, and goes properly soft at f/2.8.
SPILL_GRASS_COUNT = 15
SPILL_GRASS_SCALE = (0.26, 0.44)
SPILL_TWIG_COUNT = 15            # dry twigs lying on the paper read as debris at once
SPILL_TWIG_SCALE = (0.07, 0.13)
SPILL_FROND_COUNT = 8
SPILL_DEPTH = 0.85              # how far in front of the board edge it reaches
SPILL_CRUMB_COUNT = 170
SPILL_CRUMB_RADIUS = (0.003, 0.007)
SPILL_SPECK_COUNT = 430         # fine soil dust close to the edge
SPILL_SPECK_RADIUS = (0.0008, 0.002)
SPILL_FROND = True

# The stands. The right one is close to the lens and out of focus; the left
# one is further back and reads sharper, which is what tells the eye the room
# has depth. A single stand in an empty corner looked like a prop.
STAND_X = 0.69
STAND_Y = -1.7
STAND_HEIGHT = 2.6
STAND_RADIUS = 0.016
STAND_PAINT = (0.012, 0.012, 0.012, 1.0)
STAND_PAINT_ROUGHNESS = 0.45
SANDBAG_ALBEDO = (0.022, 0.019, 0.016, 1.0)
STAND_2_X = -1.02
STAND_2_Y = 1.15
STAND_2_HEIGHT = 2.15
# The flag on its arm, entering top left. A black rectangle on a boom is the
# single most legible "this is a lit set" object there is, and it does the job
# the empty upper left of the old plate was not doing.
# The frame tops out near z = 0.87 at this camera, so the arm hangs at 0.78 or
# it is simply not in the picture, which is where the first pass put it.
ARM_X = -1.22
ARM_Y = 0.60
ARM_Z = 0.80
ARM_LENGTH = 0.34
# Small, and in the corner. At 0.60 x 0.44 on a 0.86 m arm the panel landed in
# the middle of the frame at a third of its width and read as a wall-mounted
# television, which is the opposite of the job: a flag is an edge intrusion
# that tells you there is a rig overhead, not a subject.
# Smaller again, and far enough left that the frame cuts it. At 0.40 x 0.34 it
# survived the hero's `cover` crop as a featureless black rectangle a tenth of
# the picture wide, which reads as a hole in the image rather than as a flag.
FLAG_PANEL = (0.30, 0.27)
FLAG_PANEL_TILT_DEG = 8.0
# No cable coil. The lens is 0.17 m off the floor, so a coil is seen almost
# edge on and collapses into a flat dark ellipse whatever the turn spacing: it
# read as a frisbee left on the paper. The spill debris dresses the floor.
CABLE_TURNS = 0
CABLE_CENTRE = (-0.40, -0.95)
CABLE_RADIUS = 0.155
CABLE_THICKNESS = 0.012

# Light. A big soft key up-left-front for the garden and the floor, and one
# background lamp making the pool on the cove up-left of the mark. The pool is
# a touch warmer than the key, the way a tungsten background lamp sits
# against a daylight-balanced softbox.
KEY_LOCATION = (-1.8, -3.0, 2.8)
KEY_TARGET = (0.0, -1.0, 0.0)
KEY_SIZE = (1.6, 2.0)
KEY_POWER_W = 480.0
KEY_COLOUR = (1.0, 0.95, 0.84)   # warm white, less magenta than a blackbody
KEY_SPREAD_DEG = 70.0
# A black cutter hung just above the camera's frame line. It shadows the
# backdrop from the key, so the cove belongs to the pool lamp alone, while
# the garden and the floor in front of it stay in the key.
FLAG_Y = -0.5
FLAG_BOTTOM_Z = 0.95
FLAG_SIZE = (3.4, 2.05)          # tall: a 2 m softbox 2.5 m away throws a long penumbra
POOL_LOCATION = (-2.4, -0.2, 2.6)
# Aimed at the middle of the sweep, behind where the mark hangs, and tightened
# from 40 degrees to 26. A broad lamp lit the whole backdrop evenly, which is
# a flat wall; a pool puts the mark against light and lets the frame fall off
# into the corners on its own.
POOL_TARGET = (-0.10, 2.4, 0.62)
POOL_POWER_W = 2600.0
POOL_KELVIN = 4600.0
POOL_CONE_DEG = 26.0
POOL_BLEND = 0.62
POOL_RADIUS = 0.4
# A small hard lamp low at the back right, raking toward the camera: it puts
# a shadow wedge under the plywood edge and a rim on the plant tops against
# the dark corner. Never on the backdrop.
KICK_LOCATION = (2.6, 0.8, 0.35)
KICK_TARGET = (0.0, -0.3, 0.05)
KICK_SIZE = 0.15
KICK_POWER_W = 420.0
KICK_KELVIN = 4000.0
WORLD_STRENGTH = 0.04
WORLD_ROTATION_DEG = 60.0

# Picture.
VIEW_TRANSFORM = "AgX"
VIEW_LOOK = "AgX - Punchy"
EXPOSURE = 0.0
CPU_THREADS = 12

ROOT = Path("/home/david/Documents/GitHub/clients/cle-media")
ASSETS = ROOT / "public" / "hero3d"


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def cli() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True, type=Path)
    p.add_argument("--width", type=int, default=2560)
    p.add_argument("--samples", type=int, default=256)
    p.add_argument("--layer", choices=("all", "back", "mid", "fore"), default="all")
    return p.parse_args(argv)


def link(obj: bpy.types.Object) -> None:
    bpy.context.scene.collection.objects.link(obj)


def smooth(obj: bpy.types.Object) -> None:
    for poly in obj.data.polygons:
        poly.use_smooth = True


def principled(name: str):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    return mat, nodes, mat.node_tree.links, bsdf


def flat_material(name, colour, roughness, metallic=0.0):
    mat, _, _, bsdf = principled(name)
    bsdf.inputs["Base Color"].default_value = colour
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def image(nodes, path: Path, colour: bool):
    img = bpy.data.images.load(str(path), check_existing=True)
    img.colorspace_settings.name = "sRGB" if colour else "Non-Color"
    node = nodes.new("ShaderNodeTexImage")
    node.image = img
    return node


def sweep_material():
    mat, nodes, links, bsdf = principled("Seamless paper")
    bsdf.inputs["Base Color"].default_value = SWEEP_ALBEDO
    bsdf.inputs["Roughness"].default_value = SWEEP_ROUGHNESS
    coord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 900.0
    noise.inputs["Detail"].default_value = 3.0
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = SWEEP_TOOTH
    links.new(coord.outputs["Object"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def plywood_face_material():
    mat, nodes, links, bsdf = principled("Plywood face")
    folder = ASSETS / "tex" / "plywood"
    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (0.6, 0.6, 0.6)
    links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    diff = image(nodes, folder / "Diffuse.webp", True)
    rough = image(nodes, folder / "Rough.webp", False)
    nor = image(nodes, folder / "nor_gl.webp", False)
    nmap = nodes.new("ShaderNodeNormalMap")
    for t in (diff, rough, nor):
        t.projection = "BOX"
        t.projection_blend = 0.2
        links.new(mapping.outputs["Vector"], t.inputs["Vector"])
    links.new(diff.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(rough.outputs["Color"], bsdf.inputs["Roughness"])
    links.new(nor.outputs["Color"], nmap.inputs["Color"])
    links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def plywood_edge_material():
    """The cut edge: five plies, alternating light birch and darker glue line."""
    mat, nodes, links, bsdf = principled("Plywood edge")
    coord = nodes.new("ShaderNodeTexCoord")
    sep = nodes.new("ShaderNodeSeparateXYZ")
    links.new(coord.outputs["Object"], sep.inputs["Vector"])
    wave = nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Z"
    wave.wave_profile = "SAW"
    wave.inputs["Scale"].default_value = 1.0 / (BOARD_THICKNESS / 5.0)
    wave.inputs["Distortion"].default_value = 0.4
    links.new(coord.outputs["Object"], wave.inputs["Vector"])
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.70, 0.55, 0.32, 1.0)
    ramp.color_ramp.elements[1].position = 0.14
    ramp.color_ramp.elements[1].color = (0.10, 0.055, 0.025, 1.0)
    e = ramp.color_ramp.elements.new(0.26)
    e.color = (0.74, 0.58, 0.34, 1.0)
    links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.8
    return mat


def soil_material():
    mat, nodes, links, bsdf = principled("Soil")
    coord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 180.0
    noise.inputs["Detail"].default_value = 6.0
    links.new(coord.outputs["Object"], noise.inputs["Vector"])
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.025, 0.014, 0.007, 1.0)
    ramp.color_ramp.elements[1].color = (0.09, 0.06, 0.035, 1.0)
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.6
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Roughness"].default_value = 0.95
    return mat


def box(name, centre, dims, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=centre)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        m = obj.modifiers.new("bevel", "BEVEL")
        m.width = bevel
        m.segments = 2
    obj.data.materials.append(material)
    return obj


def cylinder(name, centre, radius, depth, material, verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=centre)
    obj = bpy.context.object
    obj.name = name
    smooth(obj)
    obj.data.materials.append(material)
    return obj


# ---------------------------------------------------------------------------
# the set
# ---------------------------------------------------------------------------
def build_sweep():
    profile = [(SWEEP_FLOOR_FRONT_Y, 0.0), (SWEEP_COVE_START_Y, 0.0)]
    cy = SWEEP_COVE_START_Y
    r = SWEEP_COVE_RADIUS
    for i in range(1, 17):
        a = (math.pi / 2) * i / 16
        profile.append((cy + r * math.sin(a), r - r * math.cos(a)))
    profile.append((cy + r, SWEEP_WALL_HEIGHT))
    verts = []
    for x in (-SWEEP_HALF_WIDTH, SWEEP_HALF_WIDTH):
        verts.extend((x, y, z) for y, z in profile)
    n = len(profile)
    faces = [(i, i + 1, n + i + 1, n + i) for i in range(n - 1)]
    mesh = bpy.data.meshes.new("sweep")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(sweep_material())
    obj = bpy.data.objects.new("Sweep", mesh)
    link(obj)
    smooth(obj)


def build_board():
    face = plywood_face_material()
    edge = plywood_edge_material()
    board = box("Board", (0, 0, BOARD_THICKNESS / 2), (BOARD_WIDTH, BOARD_DEPTH, BOARD_THICKNESS), face, BOARD_BEVEL)
    board.data.materials.append(edge)
    for poly in board.data.polygons:
        if abs(poly.normal.z) < 0.5:
            poly.material_index = 1
    soil_top = BOARD_THICKNESS + SOIL_THICKNESS
    soil = box(
        "Soil",
        (0, 0, BOARD_THICKNESS + SOIL_THICKNESS / 2),
        (BOARD_WIDTH - 2 * SOIL_INSET, BOARD_DEPTH - 2 * SOIL_INSET, SOIL_THICKNESS),
        soil_material(),
        0.003,
    )
    sub = soil.modifiers.new("subdivide", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = 5
    sub.render_levels = 6
    clouds = bpy.data.textures.new("soil crumble", type="CLOUDS")
    clouds.noise_scale = 0.025
    clouds.noise_depth = 3
    disp = soil.modifiers.new("crumble", "DISPLACE")
    disp.texture = clouds
    disp.strength = SOIL_CRUMBLE
    disp.mid_level = 0.5
    return soil_top


def import_kits() -> dict[str, list[tuple[bpy.types.Object, Vector]]]:
    """Each glTF is a kit of variants laid out in a row. Keep every variant as
    a hidden source and remember its own base centre so instances land where
    they are asked to."""
    kits = {
        "grass": "grass_medium_01/grass_medium_01_1k.gltf",
        "fern": "fern_02/fern_02_1k.gltf",
        "celandine": "celandine_01/celandine_01_1k.gltf",
        "branch": "dry_branches_medium_01/dry_branches_medium_01_1k.gltf",
        "boulder": "boulder_01/boulder_01_1k.gltf",
    }
    sources = {}
    hidden = bpy.data.collections.new("kit sources")
    bpy.context.scene.collection.children.link(hidden)
    for kind, rel in kits.items():
        bpy.ops.object.select_all(action="DESELECT")
        bpy.ops.import_scene.gltf(filepath=str(ASSETS / "model" / rel))
        meshes = [o for o in bpy.context.selected_objects if o.type == "MESH"]
        entries = []
        for o in meshes:
            lo = Vector((1e9,) * 3)
            hi = Vector((-1e9,) * 3)
            for c in o.bound_box:
                w = o.matrix_world @ Vector(c)
                lo = Vector(map(min, lo, w))
                hi = Vector(map(max, hi, w))
            base = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
            for col in list(o.users_collection):
                col.objects.unlink(o)
            hidden.objects.link(o)
            o.hide_render = True
            o.hide_viewport = True
            entries.append((o, base))
        sources[kind] = entries
        if kind == "boulder":
            for obj, _ in entries:
                for mat in obj.data.materials:
                    darken_base_colour(mat, BOULDER_VALUE, BOULDER_SATURATION)
    return sources


def darken_base_colour(mat, value: float, saturation: float) -> None:
    """Insert a hue/saturation node ahead of the Principled base colour."""
    tree = mat.node_tree
    bsdf = next((n for n in tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        return
    base = bsdf.inputs["Base Color"]
    if not base.is_linked:
        return
    link_in = base.links[0]
    hsv = tree.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Value"].default_value = value
    hsv.inputs["Saturation"].default_value = saturation
    tree.links.new(link_in.from_socket, hsv.inputs["Color"])
    tree.links.remove(link_in)
    tree.links.new(hsv.outputs["Color"], base)


def place(sources, kind, rng, location, scale, yaw, tilt=(0.0, 0.0)):
    src, base = rng.choice(sources[kind])
    xf = (
        Matrix.Translation(location)
        @ Matrix.Rotation(yaw, 4, "Z")
        @ Matrix.Rotation(tilt[0], 4, "X")
        @ Matrix.Rotation(tilt[1], 4, "Y")
        @ Matrix.Diagonal((scale, scale, scale, 1.0))
        @ Matrix.Translation(-base)
    )
    inst = src.copy()
    inst.data = src.data
    inst.hide_render = False
    inst.hide_viewport = False
    inst.name = f"{kind}"
    inst.matrix_world = xf @ src.matrix_world
    link(inst)


def plant_garden(sources, soil_top):
    rng = random.Random(RANDOM_SEED)
    hw = BOARD_WIDTH / 2 - SOIL_INSET - 0.02
    y_front = -BOARD_DEPTH / 2 + SOIL_INSET + PLANT_FRONT_MARGIN
    y_back = BOARD_DEPTH / 2 - SOIL_INSET - 0.02

    def y_pick():
        t = rng.random() ** (1.0 / BACK_DENSITY_BIAS)
        return y_front + t * (y_back - y_front)

    def x_pick():
        """Across the bed, weighted to the edges and then to the left.

        Uniform x gave an even hedge. The edges carry the bank, the centre is
        deliberately thin so the mark has air under it, and the left carries
        more than the right because the copy lands on the right."""
        u = rng.random()
        edge = 1.0 - (1.0 - u) ** 1.9          # pushed outward
        x = edge * hw * (1 if rng.random() > 0.5 else -1)
        if x > 0 and rng.random() < PLANT_LEFT_BIAS:
            x = -x
        return x

    def bank(x):
        """Height multiplier at this x: a held-down middle, rising to the
        edges, the right side lower for the copy, and a slow break along the
        length so the top reads as planting rather than as a drawn curve."""
        t = abs(x) / hw
        if t <= BANK_DIP:
            # Deepest at dead centre, back to full height at the dip's edge.
            m = BANK_CENTRE_DROP + (1.0 - BANK_CENTRE_DROP) * (t / BANK_DIP) ** 1.4
        else:
            m = 1.0 + BANK_RISE * ((t - BANK_DIP) / (1.0 - BANK_DIP)) ** BANK_PROFILE
        m *= 1.0 + BANK_BREAK * math.sin(x * 7.3 + 1.1)
        return m * (1.0 - RIGHT_DROP) if x > 0 else m

    for kind, count, scale in (
        ("boulder", BOULDER_COUNT, BOULDER_SCALE),
        ("branch", BRANCH_COUNT, BRANCH_SCALE),
        ("fern", FERN_COUNT, FERN_SCALE),
        ("celandine", CELANDINE_COUNT, CELANDINE_SCALE),
        ("grass", GRASS_COUNT, GRASS_SCALE),
    ):
        for _ in range(count):
            x = x_pick()
            y = y_pick()
            z = soil_top - (0.01 if kind == "boulder" else 0.002)
            size = rng.uniform(*scale) * (1.0 if kind == "boulder" else bank(x))
            place(sources, kind, rng, (x, y, z), size, rng.uniform(0, math.tau))


def spill(sources):
    rng = random.Random(RANDOM_SEED + 1)
    edge_y = -BOARD_DEPTH / 2
    crumb = flat_material("Crumb", SOIL_ALBEDO, 0.95)
    for _ in range(SPILL_GRASS_COUNT):
        d = rng.random() ** 0.8 * SPILL_DEPTH
        x = rng.uniform(-1.35, 1.35)
        y = edge_y - 0.01 - d
        # Lying flat on the floor, blades pointing away from where they fell.
        place(
            sources,
            "grass",
            rng,
            (x, y, 0.004),
            rng.uniform(*SPILL_GRASS_SCALE),
            rng.uniform(0, math.tau),
            tilt=(math.radians(rng.uniform(78, 92)), 0.0),
        )
    if SPILL_FROND:
        place(sources, "fern", rng, (-0.35, edge_y - 0.09, 0.004), 0.17, math.radians(200), tilt=(math.radians(88), 0.0))
        for _ in range(SPILL_FROND_COUNT - 1):
            place(
                sources,
                "fern",
                rng,
                (rng.uniform(-1.0, 1.0), edge_y - 0.02 - rng.random() ** 2 * SPILL_DEPTH, 0.004),
                rng.uniform(0.16, 0.24),
                rng.uniform(0, math.tau),
                tilt=(math.radians(rng.uniform(80, 90)), 0.0),
            )
    for _ in range(SPILL_TWIG_COUNT):
        place(
            sources,
            "branch",
            rng,
            (rng.uniform(-1.2, 1.2), edge_y - 0.02 - rng.random() ** 1.5 * SPILL_DEPTH, 0.002),
            rng.uniform(*SPILL_TWIG_SCALE),
            rng.uniform(0, math.tau),
        )
    for count, radius, reach_power in (
        (SPILL_CRUMB_COUNT, SPILL_CRUMB_RADIUS, 2.2),
        (SPILL_SPECK_COUNT, SPILL_SPECK_RADIUS, 3.0),
    ):
        for _ in range(count):
            d = rng.random() ** reach_power * SPILL_DEPTH
            x = rng.uniform(-1.25, 1.25)
            r = rng.uniform(*radius)
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=(x, edge_y - 0.004 - d, r * 0.8))
            o = bpy.context.object
            o.scale = (1.0, rng.uniform(0.7, 1.3), rng.uniform(0.5, 0.9))
            o.rotation_euler = (rng.random(), rng.random(), rng.random())
            o.data.materials.append(crumb)


def stand():
    paint = flat_material("Stand paint", STAND_PAINT, STAND_PAINT_ROUGHNESS)
    chrome = flat_material("Stand chrome", (0.8, 0.8, 0.8, 1.0), 0.25, metallic=1.0)
    cylinder("Stand riser", (STAND_X, STAND_Y, STAND_HEIGHT / 2), STAND_RADIUS, STAND_HEIGHT, paint)
    cylinder("Stand collar", (STAND_X, STAND_Y, 1.05), STAND_RADIUS * 1.9, 0.05, chrome)
    cylinder("Stand collar 2", (STAND_X, STAND_Y, 1.75), STAND_RADIUS * 1.9, 0.05, chrome)
    # Three legs at stepped heights, the turtle base of a C-stand.
    for i, (a_deg, length) in enumerate(((300, 0.44), (60, 0.40), (90, 0.30))):
        a = math.radians(a_deg)
        tilt = math.radians(74)
        half = length / 2
        centre = (
            STAND_X + half * math.sin(tilt) * math.cos(a),
            STAND_Y + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt) + i * 0.04,
        )
        leg = cylinder("Stand leg", centre, 0.012, length, paint, 16)
        leg.rotation_euler = (0.0, tilt, a)
    # The sandbag: two lobes draped over the leg that points at the camera.
    bag = flat_material("Sandbag", SANDBAG_ALBEDO, 0.9)
    leg_y = STAND_Y - 0.30
    for dx in (-0.075, 0.075):
        lobe = box("Sandbag lobe", (STAND_X + dx, leg_y, 0.05), (0.13, 0.17, 0.10), bag, 0.035)
        lobe.rotation_euler = (0.0, math.radians(-12 if dx < 0 else 12), math.radians(8))
    box("Sandbag strap", (STAND_X, leg_y, 0.11), (0.16, 0.08, 0.025), bag, 0.01)


def studio():
    """The hardware that says this is a set and not a photograph of a garden:
    a second stand back left, a flag on an arm cutting into the top corner,
    and a coil of cable left on the paper."""
    paint = flat_material("Rig paint", STAND_PAINT, STAND_PAINT_ROUGHNESS)
    chrome = flat_material("Rig chrome", (0.8, 0.8, 0.8, 1.0), 0.25, metallic=1.0)

    cylinder("Stand 2 riser", (STAND_2_X, STAND_2_Y, STAND_2_HEIGHT / 2),
             STAND_RADIUS * 0.9, STAND_2_HEIGHT, paint)
    cylinder("Stand 2 collar", (STAND_2_X, STAND_2_Y, 0.92), STAND_RADIUS * 1.7, 0.045, chrome)
    for a_deg in (200, 320, 80):
        a, tilt, length = math.radians(a_deg), math.radians(76), 0.34
        half = length / 2
        leg = cylinder("Stand 2 leg", (
            STAND_2_X + half * math.sin(tilt) * math.cos(a),
            STAND_2_Y + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt),
        ), 0.010, length, paint, 16)
        leg.rotation_euler = (0.0, tilt, a)

    arm = cylinder("Flag arm", (ARM_X + ARM_LENGTH / 2, ARM_Y, ARM_Z),
                   0.011, ARM_LENGTH, chrome, 16)
    arm.rotation_euler = (0.0, math.radians(90), 0.0)
    cylinder("Flag knuckle", (ARM_X, ARM_Y, ARM_Z), 0.030, 0.07, paint, 20)
    flag = box("Flag panel", (ARM_X + ARM_LENGTH, ARM_Y, ARM_Z - FLAG_PANEL[1] / 2 - 0.02),
               (FLAG_PANEL[0], 0.012, FLAG_PANEL[1]),
               flat_material("Flag fabric", (0.008, 0.008, 0.008, 1.0), 0.95))
    flag.rotation_euler = (0.0, 0.0, math.radians(FLAG_PANEL_TILT_DEG))

    # The coil: a torus per turn, lying flat, each slightly offset the way a
    # cable never coils twice on the same circle.
    rubber = flat_material("Cable", (0.014, 0.014, 0.015, 1.0), 0.6)
    for i in range(CABLE_TURNS):
        bpy.ops.mesh.primitive_torus_add(
            # The turns have to be a clear gap apart or the coil renders as a
            # solid disc, which reads as a frisbee on the floor.
            major_radius=CABLE_RADIUS - i * 0.048,
            minor_radius=CABLE_THICKNESS,
            major_segments=56, minor_segments=12,
            location=(CABLE_CENTRE[0] + i * 0.016, CABLE_CENTRE[1] - i * 0.012,
                      CABLE_THICKNESS + i * 0.0015),
        )
        coil = bpy.context.object
        coil.name = "Cable coil"
        coil.data.materials.append(rubber)
        smooth(coil)


def world():
    w = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    w.use_nodes = True
    nodes, links = w.node_tree.nodes, w.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputWorld")
    bg = nodes.new("ShaderNodeBackground")
    env = nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(str(ASSETS / "hdri" / "brown_photostudio_02_1k.hdr"), check_existing=True)
    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Rotation"].default_value = (0.0, 0.0, math.radians(WORLD_ROTATION_DEG))
    links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], env.inputs["Vector"])
    bg.inputs["Strength"].default_value = WORLD_STRENGTH
    links.new(env.outputs["Color"], bg.inputs["Color"])
    links.new(bg.outputs["Background"], out.inputs["Surface"])


def key():
    bpy.ops.object.light_add(type="AREA", location=KEY_LOCATION)
    k = bpy.context.object
    k.name = "Key softbox"
    k.data.shape = "RECTANGLE"
    k.data.size, k.data.size_y = KEY_SIZE
    k.data.energy = KEY_POWER_W
    k.data.spread = math.radians(KEY_SPREAD_DEG)
    k.data.color = KEY_COLOUR
    k.rotation_euler = (Vector(KEY_TARGET) - Vector(KEY_LOCATION)).to_track_quat("-Z", "Y").to_euler()

    flag_mat = flat_material("Flag", (0.01, 0.01, 0.01, 1.0), 0.9)
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(-0.2, FLAG_Y, FLAG_BOTTOM_Z + FLAG_SIZE[1] / 2))
    flag = bpy.context.object
    flag.name = "Top flag"
    flag.scale = (FLAG_SIZE[0], FLAG_SIZE[1], 1.0)
    flag.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    flag.data.materials.append(flag_mat)

    bpy.ops.object.light_add(type="SPOT", location=POOL_LOCATION)
    p = bpy.context.object
    p.name = "Background pool"
    p.data.energy = POOL_POWER_W
    p.data.spot_size = math.radians(POOL_CONE_DEG)
    p.data.spot_blend = POOL_BLEND
    p.data.shadow_soft_size = POOL_RADIUS
    p.data.use_nodes = True
    nodes, links = p.data.node_tree.nodes, p.data.node_tree.links
    emission = nodes.get("Emission")
    bb = nodes.new("ShaderNodeBlackbody")
    bb.inputs["Temperature"].default_value = POOL_KELVIN
    links.new(bb.outputs["Color"], emission.inputs["Color"])
    p.rotation_euler = (Vector(POOL_TARGET) - Vector(POOL_LOCATION)).to_track_quat("-Z", "Y").to_euler()

    bpy.ops.object.light_add(type="AREA", location=KICK_LOCATION)
    kick = bpy.context.object
    kick.name = "Kicker"
    kick.data.shape = "SQUARE"
    kick.data.size = KICK_SIZE
    kick.data.energy = KICK_POWER_W
    kick.data.spread = math.radians(90.0)
    kick.data.use_nodes = True
    nodes, links = kick.data.node_tree.nodes, kick.data.node_tree.links
    emission = nodes.get("Emission")
    bb = nodes.new("ShaderNodeBlackbody")
    bb.inputs["Temperature"].default_value = KICK_KELVIN
    links.new(bb.outputs["Color"], emission.inputs["Color"])
    kick.rotation_euler = (Vector(KICK_TARGET) - Vector(KICK_LOCATION)).to_track_quat("-Z", "Y").to_euler()


def camera():
    loc = Vector((0.0, -CAMERA_DISTANCE, CAMERA_HEIGHT))
    bpy.ops.object.camera_add(location=loc)
    cam = bpy.context.object
    cam.name = "Camera"
    cam.data.lens = CAMERA_LENS_MM
    cam.data.sensor_width = CAMERA_SENSOR_MM
    cam.data.sensor_fit = "HORIZONTAL"
    cam.rotation_euler = (math.radians(90.0 + CAMERA_PITCH_DEG), 0.0, 0.0)
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = CAMERA_DISTANCE + CAMERA_FOCUS_Y
    cam.data.dof.aperture_fstop = CAMERA_F_STOP
    cam.data.dof.aperture_blades = 9
    bpy.context.scene.camera = cam


def render(args):
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = args.samples
    s.cycles.use_denoising = True
    s.cycles.use_adaptive_sampling = True
    s.render.threads_mode = "FIXED"
    s.render.threads = CPU_THREADS
    s.render.resolution_x = args.width
    s.render.resolution_y = round(args.width / FRAME_ASPECT)
    s.render.resolution_percentage = 100
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_mode = "RGB"
    s.render.filepath = str(args.out)
    s.view_settings.view_transform = VIEW_TRANSFORM
    s.view_settings.look = VIEW_LOOK
    s.view_settings.exposure = EXPOSURE
    # Only the back plate is opaque. The other two are cut-outs that sit over
    # it, so they need alpha, and RGBA has to be asked for explicitly or Blender
    # writes the transparent film as black.
    s.render.film_transparent = args.layer not in ("all", "back")
    s.render.image_settings.color_mode = "RGBA" if s.render.film_transparent else "RGB"


def tag(name: str, fn, *a, **k):
    """Run a builder and mark everything it added, so the layers can be split
    without the builders having to know the layers exist."""
    before = set(bpy.context.scene.collection.objects)
    result = fn(*a, **k)
    for obj in set(bpy.context.scene.collection.objects) - before:
        obj["plate_layer"] = name
    return result


def isolate(layer: str) -> None:
    """Hide the other layers FROM THE CAMERA, and from nothing else.

    `visible_camera = False` is the whole trick: the object stops being drawn
    but still casts its shadow and still bounces light, so the back plate keeps
    the shadow the garden throws across the sweep and the mid plate keeps the
    green the floor returns into the leaves. Deleting the objects instead
    yields three images that will not recomposite into the shot."""
    if layer == "all":
        return
    for obj in bpy.context.scene.collection.objects:
        if obj.get("plate_layer") not in (None, layer):
            obj.visible_camera = False


def main():
    args = cli()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    tag("back", build_sweep)
    soil_top = tag("mid", build_board)
    sources = import_kits()
    tag("mid", plant_garden, sources, soil_top)
    tag("fore", spill, sources)
    tag("fore", stand)
    tag("back", studio)
    world()
    key()
    camera()
    isolate(args.layer)
    render(args)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out.with_suffix(".blend")))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
