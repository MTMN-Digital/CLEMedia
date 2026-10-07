#!/usr/bin/env python3
"""Hero plate: a small garden on a studio cyc, seen from a high tripod, in two layers.

  blender -b -P scripts/render-hero-plate.py -- \
      --out /tmp/plate.png --width 1280 --samples 48 --layer back

THE LAYERS EXIST SO THE HERO CAN PARALLAX. One flat photograph scaled up is a
zoom, not a camera move: depth is the DIFFERENCE in rate between near and far,
so the picture has to arrive in pieces. `back` is the studio with the garden
lifted out of it, `mid` is the garden alone, cut out with alpha.

Two planes only. Anything that RESTS ON THE FLOOR lives in the back plate with
the floor: a third plane of litter was tried and it slid off its own shadows,
because litter on a floor that moves at a different rate floats. The garden is
the one object with its own front and back edge, so it is the one thing that
moves against the room.

Each layer hides the other objects FROM THE CAMERA ONLY, never deletes them, so
the garden still throws its shadow across the paper in the back plate and the
floor still bounces light into the leaves in the mid plate.

Everything that is a decision is a named constant below. Units are metres,
the floor is z = 0, the camera stands on the lens axis at x = 0 and looks
along +Y, tilted down.

THE SHOT, in one paragraph. A high tripod looking DOWN at a small raised
garden standing on a wide painted cyc in a dark studio. All four timber walls
of the garden are in frame with paper floor around them. The cyc's top edge is
in frame with the dark studio and a lighting pipe above it, so the backdrop is
a thing with an end rather than a wall. A lamp stand at the left edge, a
C-stand with a bounce board at the right edge, apple boxes, pots and a
watering can on the floor say "set". The felted mark is NOT here: it is a DOM
element laid over this photograph, hanging over the garden from above the
frame, and the headline sits to the right of it on the lit floor and cove.
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

# Frame. 16:10, NOT 16:9. The page shows the plate through a plane box 108
# percent of the hero's height so the scroll can tilt through it, and a 16:9
# plate in that box was cropped seven percent at each side and eight at the
# top once the push-in settled: the rig, both stands and the dark band above
# the cyc were all composed into the picture and all outside the frame the
# reader saw. 16:10 fills the box edge to edge on a laptop. The settled frame
# shows roughly the plate's middle 88 percent vertically, so the band above
# the cyc has to start a fifth of the way down the plate to survive it.
FRAME_ASPECT = 16 / 10

# Camera. A high tripod, a wide lens, clearly tilted down into the set.
#
# Three things fight for the vertical field of view: the tilt the client asked
# for, the paper floor IN FRONT of the garden (so the garden is contained, not
# cut by the frame), and the TOP EDGE of the cyc with dark studio above it (so
# the backdrop is a built thing). A 28 mm lens is the only way to have all
# three: at 65 mm the frame was all floor, and whichever way it was tilted it
# showed either the garden or the room, never both.
#
# The height is not a free choice: the camera has to be high enough that a
# 27 degree tilt still lands the axis behind the garden, otherwise the set is
# jammed into the top of the frame. 2.9 m up and 4.1 m back puts the garden in
# the lower middle of the frame, the floor running to the bottom edge, and the
# cyc top with the dark band above it across the top.
CAMERA_DISTANCE = 4.3           # metres back from the garden's centre line
CAMERA_HEIGHT = 1.35            # metres above the floor
CAMERA_PITCH_DEG = -16.0        # negative looks down
CAMERA_LENS_MM = 28.0
CAMERA_SENSOR_MM = 36.0
# Stopped down. The whole point of the shot is that you can see the whole set;
# the depth cue is the camera height, not the bokeh.
CAMERA_F_STOP = 6.3
CAMERA_FOCUS = (-0.8, 0.0, 0.2)  # focus on the garden

# The cyc: a painted infinity cove, floor into curve into wall, wide enough to
# run off both sides of the frame at the garden's depth and show its cut edges
# only in the far top corners. The copy lands on the right of the frame, so a
# narrower paper put dark studio behind the headline at exactly the height the
# headline sits, and ink on near-black fails. Nine metres is a painted cove,
# which is what a studio that builds gardens on its floor would have.
CYC_HALF_WIDTH = 4.6
CYC_FLOOR_FRONT_Y = -5.0
CYC_COVE_START_Y = 2.3
CYC_COVE_RADIUS = 0.9
# Low enough that its TOP EDGE is in frame with a band of dark studio over it.
# A backdrop that runs out of the top of the picture is a wall; one you can
# see the end of is a set.
CYC_WALL_HEIGHT = 1.30
CYC_SCUFF_HEIGHT = 0.14
CYC_SCUFF = (0.21, 0.17, 0.10, 1.0)
CYC_ALBEDO = (0.63, 0.51, 0.30, 1.0)   # linear; roughly sRGB 0.87 0.81 0.61
CYC_ROUGHNESS = 0.85
CYC_TOOTH = 0.04                        # paint texture bump strength

# A roll of seamless on its bar above the cove's top edge, the way a studio
# keeps a spare colour hung. It is the most legible "paper" object there is.
ROLL_RADIUS = 0.07
ROLL_Z = 1.42
# Dark sage, a studio stock colour. Pale paper up there rendered as a strip
# light along the top of the cyc.
ROLL_COLOUR = (0.055, 0.075, 0.050, 1.0)

# The lighting pipe across the top of the frame, above the cyc, with two heads
# hung off it. This is the rigging the mark's ropes conceptually hang from,
# and it is what turns the dark band above the wall from "nothing" into
# "studio ceiling".
PIPE_Z = 1.76
PIPE_Y = 2.35
PIPE_RADIUS = 0.021
# Scaffold grey with a sheen, not stand black: black pipe against the dark
# band above the cyc vanished and left the heads hanging from nothing.
PIPE_COLOUR = (0.16, 0.16, 0.165, 1.0)
PIPE_HEADS = [(-1.75, (-1.6, -0.2, 0.3)), (1.55, (-0.3, 0.3, 0.3))]   # x along the pipe, what it is aimed at
HEAD_RADIUS = 0.095
HEAD_LENGTH = 0.24
HEAD_DROP = 0.14                # yoke length below the pipe

# The room the cyc stands in. Dark, so the lit paper reads as a thing with
# edges inside a larger darker space.
ROOM_SIZE = (16.0, 18.0, 6.0)
ROOM_ALBEDO = (0.030, 0.028, 0.026, 1.0)

# The garden: a raised bed with LOW timber walls, small, all four sides in
# frame, standing left of the lens axis so the felted mark hangs over it and
# the headline has the right of the frame. It is turned a few degrees so the
# camera sees two sides and a near corner: square to the lens a box reads as
# a strip, and a strip is what the previous trough was.
GARDEN_SIZE = (2.9, 2.0)        # along x, along y, outside the walls
GARDEN_CENTRE = (-1.35, -0.62)
# Turned further, so you read the long front wall, the near END wall and a
# little of the far side: three walls, which is what makes it a container
# rather than a line of timber behind some leaves.
GARDEN_YAW_DEG = -17.0
WALL_HEIGHT = 0.30              # still a boundary, but tall enough to contain
WALL_THICKNESS = 0.045
WALL_BOARDS = 2                 # boards per side, with a shadow line between
POST_SIZE = 0.065
POST_RISE = 0.03
# More timber standing above the soil. At 0.05 the walls were a thin rim the
# planting sat on top of; the client kept saying the box did not surround the
# planting, and it did not.
SOIL_DROP = 0.115               # soil surface below the top of the walls
TIMBER_BEVEL = 0.0025
TIMBER_ALBEDO = (0.042, 0.026, 0.014, 1.0)   # linear; a weathered mid brown softwood
TIMBER_GRAIN = (0.022, 0.013, 0.006, 1.0)    # the darker streaks in it
SOIL_THICKNESS = 0.012
SOIL_CRUMBLE = 0.010
SOIL_ALBEDO = (0.045, 0.028, 0.015, 1.0)

# Planting, in garden-local coordinates. The kits are real scale, so a fern
# at 0.6 is a 0.35 m fern. The bed is planted like a bed: a low carpet of
# grass everywhere so no soil shows as bare board, ferns for mass, the tall
# things toward the back and the ends so the near edge stays low and the
# timber reads. A couple of flat stones are set in near the front.
GROUND_COVER_COUNT = 900
GROUND_COVER_SCALE = (0.34, 0.60)
GRASS_COUNT = 1850
GRASS_SCALE = (0.66, 1.08)
FERN_COUNT = 210
FERN_SCALE = (0.62, 1.10)
CELANDINE_COUNT = 16
CELANDINE_SCALE = (0.55, 0.92)
BRANCH_COUNT = 7
BRANCH_SCALE = (0.26, 0.44)
STONE_COUNT = 3
STONE_SCALE = (0.045, 0.065)
STONE_VALUE = 0.55              # the scan is a pale sandstone; darken it to a garden stone
STONE_SATURATION = 0.6
# The planting stops well short of the walls. At 0.03 it grew right up to the
# timber and spilled over it, burying the rim on the far sides so only the
# front wall was ever visible.
PLANT_MARGIN = 0.13             # how close to the walls the planting goes
# Height across the depth of the bed: short at the front, tall at the back.
DEPTH_RISE = (0.72, 1.32)
END_RISE = 0.22                 # the two ends run a little taller than the middle
BREAK = 0.18                    # slow variation along the bed so the top is not a ruled line

# The lamp stand at the left edge of frame, a fresnel head on it aimed at the
# garden, a sandbag on the leg facing us. Partly behind the mark's ropes, which
# is fine: the mark hangs in front of the rig.
LAMP_STAND = (-2.95, 0.55)
LAMP_STAND_HEIGHT = 1.72
LAMP_HEAD_PITCH_DEG = -32.0

# The C-stand at the right edge with a white bounce board on its arm, in the
# top right corner. White rather than a black flag: a black card over the dark
# band above the cyc disappears, and a bounce there also motivates the light
# on the right of the floor where the headline sits.
CSTAND = (2.62, -0.30)
CSTAND_HEIGHT = 2.05
BOUNCE_CENTRE = (2.22, -0.30, 1.80)
BOUNCE_SIZE = (0.50, 0.58)
BOUNCE_YAW_DEG = 32.0
BOUNCE_PITCH_DEG = -18.0

# Floor dressing, all in the back layer because it all rests on the paper.
APPLE_BOX = (1.86, -1.12, 26.0)          # x, y, yaw
APPLE_BOX_SIZE = (0.51, 0.30, 0.20)      # a full apple box
HALF_BOX_OFFSET = (0.06, -0.02, 14.0)    # the half box stacked on it, turned a little
HALF_BOX_SIZE = (0.51, 0.30, 0.10)
TAPE_ROLLS = [(-0.09, 0.03), (0.07, -0.04)]
POTS = [
    # x, y, radius, height, what grows in it, scale of that
    (-2.62, -0.95, 0.135, 0.25, "fern", 0.40),
    (-2.28, -1.22, 0.100, 0.19, "celandine", 0.60),
    (-2.70, 1.15, 0.115, 0.21, "fern", 0.34),
]
TERRACOTTA = (0.28, 0.11, 0.055, 1.0)
WATERING_CAN = (0.62, -1.08, 150.0)      # x, y, yaw of the spout
CAN_RADIUS = 0.105
CAN_HEIGHT = 0.23
STAND_PAINT = (0.012, 0.012, 0.012, 1.0)
STAND_PAINT_ROUGHNESS = 0.45
SANDBAG_ALBEDO = (0.022, 0.019, 0.016, 1.0)
CABLE_THICKNESS = 0.011
CABLE_RUNS = [
    # from the lamp stand, forward and off the left of frame
    [(-3.02, 0.42), (-2.96, -0.05), (-3.22, -0.62), (-3.08, -1.30), (-3.45, -1.95), (-3.6, -2.6)],
    # from the C-stand, down the right edge
    [(3.08, -0.30), (2.92, -0.78), (3.18, -1.40), (3.05, -2.1)],
]
# Tape marks on the floor: the little T a camera assistant lays down. Tiny,
# and nothing says "working set" more cheaply.
FLOOR_MARKS = [(0.92, -0.62, 20.0, (0.75, 0.55, 0.05, 1.0)), (-2.3, 0.72, -35.0, (0.8, 0.8, 0.78, 1.0))]

# Light. The key is a big softbox up left and FORWARD of the set, out of frame:
# the previous visible softbox filled a third of the frame with a black cube.
# The lamps you can see are practicals: switched on, aimed at the garden,
# weak enough not to burn, there to be seen.
KEY_LOCATION = (-2.8, -2.4, 3.6)
KEY_TARGET = (-0.8, 0.1, 0.2)
KEY_SIZE = (2.4, 1.8)
KEY_POWER_W = 1150.0
KEY_COLOUR = (1.0, 0.95, 0.86)
# Fill from the right, cooler and weaker, so the set has a direction.
FILL_LOCATION = (2.8, -3.4, 2.4)
FILL_TARGET = (0.0, 0.3, 0.3)
FILL_SIZE = (3.0, 2.4)
FILL_POWER_W = 340.0
FILL_COLOUR = (0.94, 0.96, 1.0)
# The pool on the cyc behind and right of the garden. It gives the backdrop a
# gradient (bright behind the headline, falling off into the corners) which is
# what a flat wash never had, and it lights the ground the words sit on.
POOL_LOCATION = (-0.6, -0.9, 3.6)
POOL_TARGET = (1.1, 3.2, 0.95)
POOL_POWER_W = 3400.0
POOL_KELVIN = 4700.0
POOL_CONE_DEG = 34.0
POOL_BLEND = 0.55
POOL_RADIUS = 0.45
# A wash across the right of the floor behind the garden, where the lead and
# the buttons land. Measured, not assumed: the headline's red word needs 3:1
# on whatever is under it, and the set is lit so that it gets it.
WASH_LOCATION = (2.9, -1.2, 3.1)
WASH_TARGET = (1.6, 1.9, 0.0)
WASH_SIZE = (1.8, 1.4)
WASH_POWER_W = 560.0
WASH_COLOUR = (1.0, 0.97, 0.90)
# A small hard lamp low at the back right, raking toward the camera: a rim on
# the plant tops and a shadow wedge under the near timber. Never on the cyc.
KICK_LOCATION = (2.4, 1.6, 0.45)
KICK_TARGET = (-0.9, -0.3, 0.1)
KICK_SIZE = 0.15
KICK_POWER_W = 140.0
KICK_KELVIN = 4000.0
PRACTICAL_POWER_W = 55.0
PRACTICAL_KELVIN = 3200.0
PRACTICAL_CONE_DEG = 38.0

WORLD_STRENGTH = 0.04
WORLD_ROTATION_DEG = 60.0

# Picture.
VIEW_TRANSFORM = "AgX"
VIEW_LOOK = "AgX - Punchy"
# The cyc is a large light diffuse surface, so it acts as a bounce for
# everything: most of what lights the set is the paper, and exposure is set
# against the paper, not the lamps.
EXPOSURE = -0.55
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
    p.add_argument("--layer", choices=("all", "back", "mid"), default="all")
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


def emissive_material(name, colour, strength):
    """A surface that glows in shot: the glass of a lamp that is switched on.
    It carries no light itself, a spot light beside it does that."""
    mat, nodes, links, _ = principled(name)
    out = nodes.get("Material Output")
    emit = nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = colour
    emit.inputs["Strength"].default_value = strength
    links.new(emit.outputs["Emission"], out.inputs["Surface"])
    return mat


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


def cyc_material():
    mat, nodes, links, bsdf = principled("Cyc paint")
    # Dirt along the bottom, where the paint has been walked on. Driven by
    # world Z so it follows the cove up and stops, broken up by noise so the
    # edge of it is not a ruled line.
    geo = nodes.new("ShaderNodeNewGeometry")
    sep = nodes.new("ShaderNodeSeparateXYZ")
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[1].position = CYC_SCUFF_HEIGHT
    ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
    ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
    grime = nodes.new("ShaderNodeTexNoise")
    grime.inputs["Scale"].default_value = 11.0
    grime.inputs["Detail"].default_value = 6.0
    mul = nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = CYC_ALBEDO
    mix.inputs[7].default_value = CYC_SCUFF
    links.new(geo.outputs["Position"], sep.inputs["Vector"])
    links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], mul.inputs[0])
    links.new(grime.outputs["Fac"], mul.inputs[1])
    links.new(mul.outputs["Value"], mix.inputs["Factor"])
    links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = CYC_ROUGHNESS
    coord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 900.0
    noise.inputs["Detail"].default_value = 3.0
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = CYC_TOOTH
    links.new(coord.outputs["Object"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def paper_material():
    """The spare roll above the cove: plain paper, a different tone to the
    painted cyc so it reads as a separate object and not a lip of the wall."""
    return flat_material("Seamless roll", ROLL_COLOUR, 0.9)


def timber_material():
    """Sawn softwood for the garden walls."""
    mat, nodes, links, bsdf = principled("Timber")
    bsdf.inputs["Base Color"].default_value = TIMBER_ALBEDO
    bsdf.inputs["Roughness"].default_value = 0.78
    coord = nodes.new("ShaderNodeTexCoord")
    stretch = nodes.new("ShaderNodeMapping")
    stretch.inputs["Scale"].default_value = (1.0, 26.0, 26.0)
    grain = nodes.new("ShaderNodeTexNoise")
    grain.inputs["Scale"].default_value = 16.0
    grain.inputs["Detail"].default_value = 7.0
    tone = nodes.new("ShaderNodeMix")
    tone.data_type = "RGBA"
    tone.inputs[0].default_value = 0.38
    tone.inputs[6].default_value = TIMBER_ALBEDO
    tone.inputs[7].default_value = TIMBER_GRAIN
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    links.new(coord.outputs["Object"], stretch.inputs["Vector"])
    links.new(stretch.outputs["Vector"], grain.inputs["Vector"])
    links.new(grain.outputs["Fac"], tone.inputs["Factor"])
    links.new(tone.outputs[2], bsdf.inputs["Base Color"])
    links.new(grain.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def plywood_face_material():
    """Birch ply, for the apple boxes."""
    mat, nodes, links, bsdf = principled("Plywood face")
    folder = ASSETS / "tex" / "plywood"
    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1.4, 1.4, 1.4)
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


def strut(name, a, b, radius, material, verts=12):
    """A cylinder running from point a to point b. Placing cylinders at
    guessed centres with guessed angles is how the old step ladder came out
    as an easel; this never misses."""
    a, b = Vector(a), Vector(b)
    d = b - a
    obj = cylinder(name, (a + b) / 2, radius, d.length, material, verts)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def aim(obj, origin, target) -> None:
    """Point an object's -Z at a target, the way lights and cameras look."""
    obj.rotation_euler = (Vector(target) - Vector(origin)).to_track_quat("-Z", "Y").to_euler()


def tripod_legs(name, x, y, paint, length=0.42, radius=0.012, angles=(200, 320, 80)):
    for a_deg in angles:
        a, tilt = math.radians(a_deg), math.radians(75)
        half = length / 2
        leg = cylinder(name, (
            x + half * math.sin(tilt) * math.cos(a),
            y + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt),
        ), radius, length, paint, 16)
        leg.rotation_euler = (0.0, tilt, a)


def sandbag(x, y, yaw_deg):
    """Two lobes over a strap, dropped on the leg of a stand."""
    bag = flat_material("Sandbag", SANDBAG_ALBEDO, 0.9)
    rot = Matrix.Rotation(math.radians(yaw_deg), 4, "Z")
    for dx in (-0.075, 0.075):
        lobe = box("Sandbag lobe", (0, 0, 0), (0.13, 0.17, 0.10), bag, 0.035)
        lobe.matrix_world = (Matrix.Translation((x, y, 0.05)) @ rot
                             @ Matrix.Translation((dx, 0, 0))
                             @ Matrix.Rotation(math.radians(-12 if dx < 0 else 12), 4, "Y"))
    strap = box("Sandbag strap", (0, 0, 0), (0.16, 0.08, 0.025), bag, 0.01)
    strap.matrix_world = Matrix.Translation((x, y, 0.11)) @ rot


def transformed(matrix: Matrix, fn, *a, **k):
    """Run a builder in its own local frame and move everything it made by
    one matrix. The garden is built square at the origin and then turned
    and placed; the planting inside it uses the same matrix, so the plants
    turn with their walls."""
    before = set(bpy.context.scene.collection.objects)
    result = fn(*a, **k)
    for obj in set(bpy.context.scene.collection.objects) - before:
        obj.matrix_world = matrix @ obj.matrix_world
    return result


# ---------------------------------------------------------------------------
# the set
# ---------------------------------------------------------------------------
def build_cyc():
    profile = [(CYC_FLOOR_FRONT_Y, 0.0), (CYC_COVE_START_Y, 0.0)]
    cy, r = CYC_COVE_START_Y, CYC_COVE_RADIUS
    for i in range(1, 17):
        a = (math.pi / 2) * i / 16
        profile.append((cy + r * math.sin(a), r - r * math.cos(a)))
    profile.append((cy + r, CYC_WALL_HEIGHT))
    verts = []
    for x in (-CYC_HALF_WIDTH, CYC_HALF_WIDTH):
        verts.extend((x, y, z) for y, z in profile)
    n = len(profile)
    faces = [(i, i + 1, n + i + 1, n + i) for i in range(n - 1)]
    mesh = bpy.data.meshes.new("cyc")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(cyc_material())
    obj = bpy.data.objects.new("Cyc", mesh)
    link(obj)
    smooth(obj)
    # The top of the cove is a cut edge with thickness: a lip of the same
    # paint, so the edge catches light and reads as the end of a built thing.
    box("Cyc lip", (0.0, cy + r + 0.02, CYC_WALL_HEIGHT - 0.015),
        (CYC_HALF_WIDTH * 2, 0.06, 0.03), cyc_material(), 0.004)


def build_garden():
    """The raised bed, square at the origin: four low timber walls with corner
    posts, a floor, and soil sitting inside the walls a little below their
    top edge. Returns the soil's surface height."""
    wood = timber_material()
    w, d = GARDEN_SIZE
    hw, hd = w / 2, d / 2
    t, h = WALL_THICKNESS, WALL_HEIGHT

    def timber(name, centre, dims):
        return box(name, centre, dims, wood, TIMBER_BEVEL)

    timber("Garden floor", (0, 0, 0.012), (w, d, 0.024))

    # Each wall is BOARDS, not one slab. Seen almost in elevation from a low
    # lens, a single 3.3m x 0.3m panel is a featureless plank of colour and it
    # is the main reason the bed read as cheap; two boards with a shadow line
    # between them read as something built out of timber.
    gap = 0.012
    board_h = (h - gap * (WALL_BOARDS - 1)) / WALL_BOARDS
    for i in range(WALL_BOARDS):
        z = board_h / 2 + i * (board_h + gap)
        timber("Garden wall front", (0, -hd + t / 2, z), (w, t, board_h))
        timber("Garden wall back", (0, hd - t / 2, z), (w, t, board_h))
        for side in (-1, 1):
            timber("Garden wall end", (side * (hw - t / 2), 0, z), (t, d - 2 * t, board_h))
    for sx in (-1, 1):
        for sy in (-1, 1):
            timber("Garden post",
                   (sx * (hw - POST_SIZE / 2), sy * (hd - POST_SIZE / 2), (h + POST_RISE) / 2),
                   (POST_SIZE, POST_SIZE, h + POST_RISE))

    soil_top = h - SOIL_DROP
    soil = box("Soil", (0, 0, soil_top - SOIL_THICKNESS / 2),
               (w - 2 * t - 0.004, d - 2 * t - 0.004, SOIL_THICKNESS), soil_material(), 0.003)
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
        "stone": "boulder_01/boulder_01_1k.gltf",
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
        if kind == "stone":
            for obj, _ in entries:
                for mat in obj.data.materials:
                    darken_base_colour(mat, STONE_VALUE, STONE_SATURATION)
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


def place(sources, kind, rng, location, scale, yaw, tilt=(0.0, 0.0), flatten=1.0):
    src, base = rng.choice(sources[kind])
    xf = (
        Matrix.Translation(location)
        @ Matrix.Rotation(yaw, 4, "Z")
        @ Matrix.Rotation(tilt[0], 4, "X")
        @ Matrix.Rotation(tilt[1], 4, "Y")
        @ Matrix.Diagonal((scale, scale, scale * flatten, 1.0))
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
    """Planting, in the garden's own frame (the caller turns and places it)."""
    rng = random.Random(RANDOM_SEED)
    w, d = GARDEN_SIZE
    hw = w / 2 - WALL_THICKNESS - PLANT_MARGIN
    hd = d / 2 - WALL_THICKNESS - PLANT_MARGIN

    def height(x, y):
        """Short at the front, tall at the back, a little taller at the two
        ends, and a slow break along the length so the top of the planting is
        not a drawn line."""
        t = (y + hd) / (2 * hd)
        m = DEPTH_RISE[0] + (DEPTH_RISE[1] - DEPTH_RISE[0]) * t ** 1.3
        m *= 1.0 + END_RISE * (abs(x) / hw) ** 2.2
        m *= 1.0 + BREAK * math.sin(x * 6.1 + 0.7) * math.cos(y * 4.3)
        return m

    # The carpet goes down first and takes no height multiplier: its whole
    # job is that no patch of soil reads as bare board.
    for _ in range(GROUND_COVER_COUNT):
        place(sources, "grass", rng, (rng.uniform(-hw, hw), rng.uniform(-hd, hd), soil_top - 0.002),
              rng.uniform(*GROUND_COVER_SCALE), rng.uniform(0, math.tau))

    # Stepping stones near the front, flattened into the soil.
    for i in range(STONE_COUNT):
        x = -hw * 0.55 + i * hw * 0.55 + rng.uniform(-0.08, 0.08)
        y = -hd * 0.45 + rng.uniform(-0.06, 0.06)
        place(sources, "stone", rng, (x, y, soil_top - 0.02), rng.uniform(*STONE_SCALE),
              rng.uniform(0, math.tau), flatten=0.45)

    for kind, count, scale in (
        ("branch", BRANCH_COUNT, BRANCH_SCALE),
        ("fern", FERN_COUNT, FERN_SCALE),
        ("celandine", CELANDINE_COUNT, CELANDINE_SCALE),
        ("grass", GRASS_COUNT, GRASS_SCALE),
    ):
        for _ in range(count):
            x = rng.uniform(-hw, hw)
            # Crowd the taller things toward the back.
            y = -hd + (rng.random() ** (0.8 if kind == "grass" else 0.65)) * 2 * hd
            size = rng.uniform(*scale) * height(x, y)
            place(sources, kind, rng, (x, y, soil_top - 0.002), size, rng.uniform(0, math.tau))


def room():
    """A dark box around everything. The cyc has edges, so something has to
    be beside and above it, and a dim studio is what makes the lit paper read
    as an object with an end rather than as the background."""
    dark = flat_material("Room", ROOM_ALBEDO, 0.92)
    w, d, h = ROOM_SIZE
    shell = box("Room", (0.0, 1.0, h / 2 - 0.9), (w, d, h), dark)
    shell.data.flip_normals() if hasattr(shell.data, "flip_normals") else None


def overhead():
    """The roll on its bar above the cove, and the lighting pipe above that
    with two heads hung off it. This is the band of studio over the set."""
    steel = flat_material("Rig steel", (0.55, 0.55, 0.56, 1.0), 0.35, metallic=1.0)
    paint = flat_material("Rig paint", STAND_PAINT, 0.82)
    roll_y = CYC_COVE_START_Y + CYC_COVE_RADIUS + ROLL_RADIUS + 0.04
    roll = cylinder("Paper roll", (0.0, roll_y, ROLL_Z), ROLL_RADIUS, CYC_HALF_WIDTH * 2 * 0.62,
                    paper_material(), 40)
    roll.rotation_euler = (0.0, math.radians(90), 0.0)
    bar = cylinder("Roll bar", (0.0, roll_y, ROLL_Z), 0.016, CYC_HALF_WIDTH * 2 + 0.4, steel, 20)
    bar.rotation_euler = (0.0, math.radians(90), 0.0)

    pipe = cylinder("Lighting pipe", (0.0, PIPE_Y, PIPE_Z), PIPE_RADIUS, CYC_HALF_WIDTH * 2 + 1.2,
                    flat_material("Pipe", PIPE_COLOUR, 0.42, metallic=0.6), 24)
    pipe.rotation_euler = (0.0, math.radians(90), 0.0)
    glass = emissive_material("Lamp glass", (1.0, 0.86, 0.66, 1.0), 9.0)
    for x, target in PIPE_HEADS:
        yoke_z = PIPE_Z - HEAD_DROP
        cylinder("Head clamp", (x, PIPE_Y, PIPE_Z), PIPE_RADIUS * 2.2, 0.07, steel, 16)
        strut("Head yoke", (x, PIPE_Y, PIPE_Z - 0.03), (x, PIPE_Y, yoke_z), 0.012, paint)
        head = cylinder("Lamp head", (0, 0, 0), HEAD_RADIUS, HEAD_LENGTH, paint, 32)
        # The head's -Z is its face, aimed the way a light is aimed.
        origin = Vector((x, PIPE_Y, yoke_z))
        rot = (Vector(target) - origin).to_track_quat("-Z", "Y").to_matrix().to_4x4()
        head.matrix_world = Matrix.Translation(origin) @ rot
        face = cylinder("Lamp face", (0, 0, 0), HEAD_RADIUS * 0.8, 0.012, glass, 32)
        face.matrix_world = Matrix.Translation((x, PIPE_Y, yoke_z)) @ rot @ Matrix.Translation((0, 0, -HEAD_LENGTH / 2 - 0.004))
        # Barn doors, two leaves, open.
        for side, ang in ((1, 35.0), (-1, -35.0)):
            leaf = box("Barn door", (0, 0, 0), (HEAD_RADIUS * 1.9, 0.004, HEAD_RADIUS * 1.1), paint)
            leaf.matrix_world = (Matrix.Translation((x, PIPE_Y, yoke_z)) @ rot
                                 @ Matrix.Translation((0, side * HEAD_RADIUS, -HEAD_LENGTH / 2 - 0.01))
                                 @ Matrix.Rotation(math.radians(ang), 4, "X")
                                 @ Matrix.Translation((0, side * 0.002, -HEAD_RADIUS * 0.5)))
        # The practical: a weak spot in the head, aimed where the head points.
        bpy.ops.object.light_add(type="SPOT", location=(x, PIPE_Y, yoke_z))
        spot = bpy.context.object
        spot.name = "Practical"
        spot.data.energy = PRACTICAL_POWER_W
        spot.data.spot_size = math.radians(PRACTICAL_CONE_DEG)
        spot.data.spot_blend = 0.5
        spot.data.shadow_soft_size = 0.06
        spot.rotation_euler = rot.to_euler()
        spot.visible_camera = False
        blackbody(spot, PRACTICAL_KELVIN)


def blackbody(light, kelvin):
    light.data.use_nodes = True
    nodes, links = light.data.node_tree.nodes, light.data.node_tree.links
    emission = nodes.get("Emission")
    bb = nodes.new("ShaderNodeBlackbody")
    bb.inputs["Temperature"].default_value = kelvin
    links.new(bb.outputs["Color"], emission.inputs["Color"])


def lamp_stand():
    """A stand at the left edge of frame with a fresnel head aimed into the
    garden, a sandbag on the leg that faces us, and its cable away across
    the floor."""
    paint = flat_material("Stand paint", STAND_PAINT, STAND_PAINT_ROUGHNESS)
    chrome = flat_material("Stand chrome", (0.8, 0.8, 0.8, 1.0), 0.25, metallic=1.0)
    x, y = LAMP_STAND
    H = LAMP_STAND_HEIGHT
    cylinder("Lamp riser", (x, y, H / 2), 0.017, H, paint)
    cylinder("Lamp collar", (x, y, 0.95), 0.032, 0.05, chrome)
    cylinder("Lamp collar 2", (x, y, 1.45), 0.030, 0.05, chrome)
    tripod_legs("Lamp leg", x, y, paint)
    sandbag(x + 0.22, y - 0.22, 40.0)

    gx, gy = GARDEN_CENTRE
    head = cylinder("Lamp head", (0, 0, 0), 0.11, 0.26, paint, 32)
    target = Vector((gx, gy, 0.3))
    origin = Vector((x, y, H + 0.1))
    head.matrix_world = Matrix.Translation(origin) @ (target - origin).to_track_quat("-Z", "Y").to_matrix().to_4x4()
    face = cylinder("Lamp face", (0, 0, 0), 0.09, 0.012, emissive_material("Lamp glass 2", (1.0, 0.86, 0.66, 1.0), 7.0), 32)
    face.matrix_world = head.matrix_world @ Matrix.Translation((0, 0, -0.134))
    strut("Lamp yoke", (x, y, H), (x, y, H + 0.1), 0.014, paint)
    bpy.ops.object.light_add(type="SPOT", location=origin)
    spot = bpy.context.object
    spot.name = "Practical stand"
    spot.data.energy = PRACTICAL_POWER_W * 1.6
    spot.data.spot_size = math.radians(PRACTICAL_CONE_DEG)
    spot.data.spot_blend = 0.5
    spot.data.shadow_soft_size = 0.07
    aim(spot, origin, target)
    spot.visible_camera = False
    blackbody(spot, PRACTICAL_KELVIN)


def c_stand():
    """A C-stand at the right edge, its arm reaching into the top corner of
    the frame with a white bounce board on the end."""
    paint = flat_material("C-stand paint", STAND_PAINT, STAND_PAINT_ROUGHNESS)
    chrome = flat_material("C-stand chrome", (0.8, 0.8, 0.8, 1.0), 0.25, metallic=1.0)
    x, y = CSTAND
    H = CSTAND_HEIGHT
    cylinder("C riser", (x, y, H / 2), 0.016, H, paint)
    cylinder("C collar", (x, y, 1.1), 0.030, 0.05, chrome)
    cylinder("C collar 2", (x, y, 1.72), 0.028, 0.05, chrome)
    # The turtle base: three legs at stepped heights.
    for i, (a_deg, length) in enumerate(((300, 0.44), (60, 0.40), (160, 0.30))):
        a, tilt = math.radians(a_deg), math.radians(74)
        half = length / 2
        leg = cylinder("C leg", (
            x + half * math.sin(tilt) * math.cos(a),
            y + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt) + i * 0.04,
        ), 0.012, length, paint, 16)
        leg.rotation_euler = (0.0, tilt, a)
    sandbag(x - 0.25, y - 0.28, -30.0)

    bx, by, bz = BOUNCE_CENTRE
    knuckle = (x, y, H)
    cylinder("C knuckle", knuckle, 0.034, 0.06, chrome).rotation_euler = (math.radians(90), 0, 0)
    strut("C arm", knuckle, (bx + 0.05, by, bz), 0.011, paint)
    rot = Matrix.Rotation(math.radians(BOUNCE_YAW_DEG), 4, "Z") @ Matrix.Rotation(math.radians(BOUNCE_PITCH_DEG), 4, "X")
    bw, bh = BOUNCE_SIZE
    board = box("Bounce board", (0, 0, 0), (bw, 0.022, bh), flat_material("Poly board", (0.86, 0.85, 0.82, 1.0), 0.8), 0.004)
    board.matrix_world = Matrix.Translation((bx, by, bz)) @ rot
    clamp = box("Bounce clamp", (0, 0, 0), (0.05, 0.05, 0.09), paint, 0.006)
    clamp.matrix_world = Matrix.Translation((bx, by, bz)) @ rot @ Matrix.Translation((bw / 2 - 0.03, 0.02, 0))


def dressing(sources):
    """What stands on the paper besides the garden: apple boxes with tape on
    them, pots with plants in them, a watering can, cable runs, tape marks.
    All of it is in the back layer because all of it rests on the floor."""
    rng = random.Random(RANDOM_SEED + 3)
    ply = plywood_face_material()
    ax, ay, ayaw = APPLE_BOX
    full = box("Apple box", (0, 0, 0), APPLE_BOX_SIZE, ply, 0.004)
    full.matrix_world = Matrix.Translation((ax, ay, APPLE_BOX_SIZE[2] / 2)) @ Matrix.Rotation(math.radians(ayaw), 4, "Z")
    hx, hy, hyaw = HALF_BOX_OFFSET
    half = box("Half apple", (0, 0, 0), HALF_BOX_SIZE, ply, 0.004)
    half_top = APPLE_BOX_SIZE[2] + HALF_BOX_SIZE[2]
    half.matrix_world = Matrix.Translation((ax + hx, ay + hy, APPLE_BOX_SIZE[2] + HALF_BOX_SIZE[2] / 2)) @ Matrix.Rotation(math.radians(ayaw + hyaw), 4, "Z")
    # The hand holes in the long sides.
    hole = flat_material("Hole", (0.01, 0.01, 0.01, 1.0), 0.9)
    for side in (-1, 1):
        h = box("Hand hole", (0, 0, 0), (0.11, 0.006, 0.03), hole)
        h.matrix_world = full.matrix_world @ Matrix.Translation((0, side * (APPLE_BOX_SIZE[1] / 2 + 0.001), 0.03))
    rubber = flat_material("Tape", (0.010, 0.010, 0.011, 1.0), 0.6)
    for i, (dx, dy) in enumerate(TAPE_ROLLS):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.018,
                                         major_segments=40, minor_segments=12, location=(0, 0, 0))
        t = bpy.context.object
        t.name = f"Tape {i}"
        t.data.materials.append(rubber)
        smooth(t)
        t.matrix_world = half.matrix_world @ Matrix.Translation((dx, dy, HALF_BOX_SIZE[2] / 2 + 0.022))

    clay = flat_material("Terracotta", TERRACOTTA, 0.85)
    for px, py, r, h, kind, scale in POTS:
        pot = cylinder("Pot", (px, py, h / 2), r, h, clay, 40)
        pot.scale = (1.0, 1.0, 1.0)
        # Tapered: narrower at the foot.
        for v in pot.data.vertices:
            if v.co.z < 0:
                v.co.x *= 0.78
                v.co.y *= 0.78
        cylinder("Pot rim", (px, py, h - 0.012), r * 1.06, 0.024, clay, 40)
        cylinder("Pot soil", (px, py, h - 0.03), r * 0.94, 0.01, soil_material(), 32)
        place(sources, kind, rng, (px, py, h - 0.028), scale, rng.uniform(0, math.tau))

    cx, cy, cyaw = WATERING_CAN
    zinc = flat_material("Galvanised", (0.42, 0.43, 0.42, 1.0), 0.38, metallic=1.0)
    cylinder("Can body", (cx, cy, CAN_HEIGHT / 2), CAN_RADIUS, CAN_HEIGHT, zinc, 40)
    cylinder("Can neck", (cx, cy, CAN_HEIGHT + 0.02), CAN_RADIUS * 0.38, 0.05, zinc, 24)
    spout_dir = Vector((math.cos(math.radians(cyaw)), math.sin(math.radians(cyaw)), 0.0))
    spout_from = Vector((cx, cy, CAN_HEIGHT * 0.35)) + spout_dir * CAN_RADIUS * 0.9
    spout_to = Vector((cx, cy, CAN_HEIGHT + 0.07)) + spout_dir * (CAN_RADIUS + 0.19)
    strut("Can spout", spout_from, spout_to, 0.011, zinc, 16)
    cylinder("Can rose", spout_to + spout_dir * 0.015, 0.03, 0.025, zinc, 24).rotation_euler = (spout_to - spout_from).to_track_quat("Z", "Y").to_euler()
    bpy.ops.mesh.primitive_torus_add(major_radius=CAN_RADIUS * 0.72, minor_radius=0.009,
                                     major_segments=48, minor_segments=10, location=(cx, cy, CAN_HEIGHT))
    handle = bpy.context.object
    handle.name = "Can handle"
    handle.data.materials.append(zinc)
    smooth(handle)
    handle.rotation_euler = (math.radians(90), 0.0, math.radians(cyaw + 90))

    rubber = flat_material("Cable", (0.006, 0.006, 0.007, 1.0), 0.78)
    for run in CABLE_RUNS:
        for (x0, y0), (x1, y1) in zip(run, run[1:]):
            dx, dy = x1 - x0, y1 - y0
            seg = cylinder("Cable run", ((x0 + x1) / 2, (y0 + y1) / 2, CABLE_THICKNESS),
                           CABLE_THICKNESS, math.hypot(dx, dy) + 0.02, rubber, 14)
            seg.rotation_euler = (0.0, math.radians(90), math.atan2(dy, dx))

    for mx, my, myaw, colour in FLOOR_MARKS:
        tape = flat_material("Floor tape", colour, 0.6)
        rot = Matrix.Rotation(math.radians(myaw), 4, "Z")
        a = box("Mark", (0, 0, 0), (0.16, 0.025, 0.002), tape)
        a.matrix_world = Matrix.Translation((mx, my, 0.001)) @ rot
        b = box("Mark", (0, 0, 0), (0.025, 0.10, 0.002), tape)
        b.matrix_world = Matrix.Translation((mx, my, 0.001)) @ rot @ Matrix.Translation((0, -0.06, 0))


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


def area(name, location, target, size, power, colour=None, spread=100.0):
    bpy.ops.object.light_add(type="AREA", location=location)
    l = bpy.context.object
    l.name = name
    l.data.shape = "RECTANGLE"
    l.data.size, l.data.size_y = size
    l.data.energy = power
    l.data.spread = math.radians(spread)
    if colour:
        l.data.color = colour
    aim(l, location, target)
    l.visible_camera = False
    return l


def lights():
    """The lamps that do the work are all out of frame. The lamps you can see
    are practicals and only have to look switched on."""
    area("Key softbox", KEY_LOCATION, KEY_TARGET, KEY_SIZE, KEY_POWER_W, KEY_COLOUR, 80.0)
    area("Fill", FILL_LOCATION, FILL_TARGET, FILL_SIZE, FILL_POWER_W, FILL_COLOUR, 110.0)
    area("Floor wash", WASH_LOCATION, WASH_TARGET, WASH_SIZE, WASH_POWER_W, WASH_COLOUR, 95.0)

    bpy.ops.object.light_add(type="SPOT", location=POOL_LOCATION)
    p = bpy.context.object
    p.name = "Cyc pool"
    p.data.energy = POOL_POWER_W
    p.data.spot_size = math.radians(POOL_CONE_DEG)
    p.data.spot_blend = POOL_BLEND
    p.data.shadow_soft_size = POOL_RADIUS
    aim(p, POOL_LOCATION, POOL_TARGET)
    p.visible_camera = False
    blackbody(p, POOL_KELVIN)

    bpy.ops.object.light_add(type="AREA", location=KICK_LOCATION)
    kick = bpy.context.object
    kick.name = "Kicker"
    kick.data.shape = "SQUARE"
    kick.data.size = KICK_SIZE
    kick.data.energy = KICK_POWER_W
    kick.data.spread = math.radians(90.0)
    aim(kick, KICK_LOCATION, KICK_TARGET)
    kick.visible_camera = False
    blackbody(kick, KICK_KELVIN)


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
    cam.data.dof.focus_distance = (Vector(CAMERA_FOCUS) - loc).length
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
    s.render.filepath = str(args.out)
    s.view_settings.view_transform = VIEW_TRANSFORM
    s.view_settings.look = VIEW_LOOK
    s.view_settings.exposure = EXPOSURE
    # Only the back plate is opaque. The mid plate is a cut-out that sits over
    # it, so it needs alpha, and RGBA has to be asked for explicitly or Blender
    # writes the transparent film as black.
    s.render.film_transparent = args.layer == "mid"
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
    the shadow the garden throws across the paper and the mid plate keeps the
    light the floor returns into the leaves. Deleting the objects instead
    yields two images that will not recomposite into the shot."""
    if layer == "all":
        return
    for obj in bpy.context.scene.collection.objects:
        if obj.get("plate_layer") not in (None, layer):
            obj.visible_camera = False


def main():
    args = cli()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sources = import_kits()
    garden_matrix = Matrix.Translation((*GARDEN_CENTRE, 0.0)) @ Matrix.Rotation(math.radians(GARDEN_YAW_DEG), 4, "Z")
    tag("back", build_cyc)
    soil_top = tag("mid", transformed, garden_matrix, build_garden)
    tag("mid", transformed, garden_matrix, plant_garden, sources, soil_top)
    tag("back", room)
    tag("back", overhead)
    tag("back", lamp_stand)
    tag("back", c_stand)
    tag("back", dressing, sources)
    world()
    lights()
    camera()
    isolate(args.layer)
    render(args)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out.with_suffix(".blend")))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
