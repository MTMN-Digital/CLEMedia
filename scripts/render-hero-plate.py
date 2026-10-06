#!/usr/bin/env python3
"""Render the offline tabletop-garden hero plate with Blender Cycles.

Run from the repository root:
  pbuild run --weight 6G -- /home/david/.local/bin/blender -b -P scripts/render-hero-plate.py -- --out /tmp/hero.png --width 1280 --samples 32

All scene direction is deliberately gathered in the constants below. Keep the
plant seed fixed when comparing revisions, otherwise the garden changes too.
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
# ART DIRECTION KNOBS
# ---------------------------------------------------------------------------
RANDOM_SEED = 1042                 # Fixed seed for the garden layout.
FRAME_ASPECT = 16 / 10             # Output width divided by output height.
CAMERA_LOCATION = (0.0, -14.0, 7.0)
CAMERA_TARGET = (0.0, 1.1, 2.25)
CAMERA_LENS_MM = 50.0
CAMERA_F_STOP = 11.0               # Kept high so the browser crop stays crisp.
BOARD_SIZE = (12.0, 3.2, 0.46)
BOARD_LOCATION = (0.0, 2.00, 0.50)
SOIL_SIZE = (11.4, 2.6, 0.16)
SOIL_LOCATION = (0.0, 2.00, 0.79)
GARDEN_CLEAR_HALF_WIDTH = 2.25     # Empty centre for the hanging browser mark.
GARDEN_CLUSTER_X = 3.45            # Left and right garden bank centres.
GARDEN_CLUSTER_JITTER_X = 1.65
GARDEN_DEPTH_RANGE = (0.75, 3.20)
PLANT_BASE_Z = 0.96
PLANT_COUNT_PER_SIDE = 30
GRASS_SCALE = (0.48, 0.82)
FERN_SCALE = (0.48, 0.76)
CELANDINE_SCALE = (0.38, 0.62)
WORLD_STRENGTH = 0.42
KEY_LOCATION = (-5.4, -4.0, 8.8)
KEY_ENERGY_WATTS = 1050.0
KEY_SIZE_METRES = 5.0
KEY_COLOUR = (1.0, 0.67, 0.42)
SWEEP_HALF_WIDTH = 17.0
SWEEP_FLOOR_FRONT = -6.5
SWEEP_COVE_START_Y = 3.85
SWEEP_COVE_RADIUS = 1.85
SWEEP_COVE_CENTRE_Y = 5.70
SWEEP_WALL_HEIGHT = 10.5
RIG_BAR_LOCATION = (0.0, 3.4, 5.55)
RIG_BAR_LENGTH = 14.0
RIG_BAR_RADIUS = 0.075
RIG_DROP_X = (-6.2, 6.2)
RIG_DROP_BOTTOM_Z = 4.20
RIG_DROP_DEPTH = 2.7
RIG_DROP_RADIUS = 0.045
STAND_X = (-5.65, 5.85)
STAND_Y = 1.95
STAND_HEIGHT = 5.8
STAND_RADIUS = 0.065
STAND_FOOT_RADIUS = 0.62
STAND_FOOT_DEPTH = 0.08
STAND_FOOT_Z = 0.10
SOFTBOX_LOCATION = (4.2, 2.95, 5.25)
SOFTBOX_SIZE = (2.0, 0.20, 1.15)
SOFTBOX_DIFFUSER_LOCATION = (4.2, 2.80, 5.25)
SOFTBOX_DIFFUSER_SIZE = (1.78, 0.035, 0.94)
SOFTBOX_DIFFUSER_COLOUR = (1.0, 0.82, 0.58, 1.0)
SOFTBOX_DIFFUSER_ROUGHNESS = 0.35
SWEEP_COLOUR = (0.68, 0.54, 0.39, 1.0)
SWEEP_ROUGHNESS = 0.76
SOIL_COLOUR = (0.09, 0.045, 0.018, 1.0)
BOARD_BEVEL = 0.08
SOIL_BEVEL = 0.04
PBR_TEXTURE_SCALE = (1.4, 1.4, 1.4)
PBR_AO_STRENGTH = 0.34
METALNESS = 0.82
RENDER_EXPOSURE = 0.65
CPU_THREADS = 16


ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / "public" / "hero3d"


def blender_arguments() -> argparse.Namespace:
    """Read only arguments placed after Blender's required double dash."""
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path, help="PNG output path")
    parser.add_argument("--width", type=int, default=2560, help="Output width in pixels")
    parser.add_argument("--samples", type=int, default=256, help="Cycles samples per pixel")
    args = parser.parse_args(argv)
    if args.width < 320:
        parser.error("--width must be at least 320")
    if args.samples < 1:
        parser.error("--samples must be at least 1")
    return args


def look_at(obj: bpy.types.Object, target: tuple[float, float, float]) -> None:
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def set_smooth(obj: bpy.types.Object) -> None:
    if obj.type != "MESH":
        return
    for polygon in obj.data.polygons:
        polygon.use_smooth = True


def cube(name: str, location, dimensions, material, bevel: float = 0.0) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Soft edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    obj.data.materials.append(material)
    return obj


def cylinder(name: str, location, radius: float, depth: float, material) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    set_smooth(obj)
    obj.data.materials.append(material)
    return obj


def image_node(nodes, path: Path, colour: bool):
    image = bpy.data.images.load(str(path), check_existing=True)
    image.colorspace_settings.name = "sRGB" if colour else "Non-Color"
    node = nodes.new("ShaderNodeTexImage")
    node.image = image
    node.interpolation = "Linear"
    return node


def pbr_material(name: str, texture_name: str) -> bpy.types.Material:
    """Use every supplied PBR map on a material with generated coordinates."""
    folder = ASSET_ROOT / "tex" / texture_name
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes, links = material.node_tree.nodes, material.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    texcoord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = PBR_TEXTURE_SCALE
    links.new(texcoord.outputs["Generated"], mapping.inputs["Vector"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

    diffuse = image_node(nodes, folder / "Diffuse.webp", True)
    roughness = image_node(nodes, folder / "Rough.webp", False)
    normal = image_node(nodes, folder / "nor_gl.webp", False)
    occlusion = image_node(nodes, folder / "AO.webp", False)
    normal_map = nodes.new("ShaderNodeNormalMap")
    multiply = nodes.new("ShaderNodeMixRGB")
    multiply.blend_type = "MULTIPLY"
    multiply.inputs[0].default_value = PBR_AO_STRENGTH
    for texture in (diffuse, roughness, normal, occlusion):
        links.new(mapping.outputs["Vector"], texture.inputs["Vector"])
    links.new(diffuse.outputs["Color"], multiply.inputs[1])
    links.new(occlusion.outputs["Color"], multiply.inputs[2])
    links.new(multiply.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(roughness.outputs["Color"], bsdf.inputs["Roughness"])
    links.new(normal.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], bsdf.inputs["Normal"])
    if texture_name == "metal_plate":
        bsdf.inputs["Metallic"].default_value = METALNESS
    return material


def simple_material(name: str, colour, roughness: float, metallic: float = 0.0) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.diffuse_color = colour
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = colour
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return material


def make_sweep(material) -> bpy.types.Object:
    """Create one broad floor, quarter-round cove and wall mesh."""
    profile = [(SWEEP_FLOOR_FRONT, 0.0), (SWEEP_COVE_START_Y, 0.0)]
    radius, centre_y = SWEEP_COVE_RADIUS, SWEEP_COVE_CENTRE_Y
    for step in range(1, 9):
        angle = (math.pi / 2) * (step / 8)
        profile.append((centre_y - radius * math.cos(angle), radius * math.sin(angle)))
    profile.extend([(centre_y, SWEEP_WALL_HEIGHT)])
    half_width = SWEEP_HALF_WIDTH
    verts = []
    for x in (-half_width, half_width):
        verts.extend((x, y, z) for y, z in profile)
    rows = len(profile)
    faces = []
    for index in range(rows - 1):
        faces.append((index, index + 1, rows + index + 1, rows + index))
    mesh = bpy.data.meshes.new("Cyclorama mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(material)
    sweep = bpy.data.objects.new("Cyclorama sweep", mesh)
    bpy.context.scene.collection.objects.link(sweep)
    set_smooth(sweep)
    return sweep


def import_plant_sources() -> dict[str, list[bpy.types.Object]]:
    """Import each glTF once, then keep it hidden as linked-mesh source data."""
    sources = {}
    source_collection = bpy.data.collections.new("Plant mesh sources")
    bpy.context.scene.collection.children.link(source_collection)
    gltfs = {
        "grass": ASSET_ROOT / "model" / "grass_medium_01" / "grass_medium_01_1k.gltf",
        "fern": ASSET_ROOT / "model" / "fern_02" / "fern_02_1k.gltf",
        "celandine": ASSET_ROOT / "model" / "celandine_01" / "celandine_01_1k.gltf",
    }
    for kind, gltf in gltfs.items():
        bpy.ops.object.select_all(action="DESELECT")
        bpy.ops.import_scene.gltf(filepath=str(gltf))
        imported = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
        if not imported:
            raise RuntimeError(f"No mesh imported from {gltf}")
        for obj in imported:
            for collection in list(obj.users_collection):
                collection.objects.unlink(obj)
            source_collection.objects.link(obj)
            obj.hide_render = True
            obj.hide_viewport = True
        sources[kind] = imported
    return sources


def plant_instance(sources, kind: str, location, scale: float, rotation: float) -> None:
    """Create a linked mesh copy, retaining glTF material and alpha details."""
    transform = Matrix.Translation(location) @ Matrix.Rotation(rotation, 4, "Z") @ Matrix.Diagonal((scale, scale, scale, 1.0))
    for source in sources[kind]:
        instance = source.copy()
        instance.data = source.data
        instance.animation_data_clear()
        instance.name = f"{kind} instance"
        instance.hide_render = False
        instance.hide_viewport = False
        instance.matrix_world = transform @ source.matrix_world
        bpy.context.scene.collection.objects.link(instance)


def plant_banks(sources) -> None:
    rng = random.Random(RANDOM_SEED)
    for side in (-1, 1):
        for _ in range(PLANT_COUNT_PER_SIDE):
            x = side * (GARDEN_CLUSTER_X + rng.uniform(-GARDEN_CLUSTER_JITTER_X, GARDEN_CLUSTER_JITTER_X))
            y = rng.uniform(*GARDEN_DEPTH_RANGE)
            # Preserve an intentionally open central aisle for the mark and copy.
            if abs(x) < GARDEN_CLEAR_HALF_WIDTH:
                x = side * GARDEN_CLEAR_HALF_WIDTH
            dice = rng.random()
            if dice < 0.58:
                kind, scale_range = "grass", GRASS_SCALE
            elif dice < 0.84:
                kind, scale_range = "fern", FERN_SCALE
            else:
                kind, scale_range = "celandine", CELANDINE_SCALE
            plant_instance(
                sources,
                kind,
                (x, y, PLANT_BASE_Z),
                rng.uniform(*scale_range),
                rng.uniform(0.0, math.tau),
            )


def studio_kit(metal) -> None:
    """Add visible rig hardware, one key softbox and an edge stand."""
    bar = cylinder("Overhead rig bar", RIG_BAR_LOCATION, RIG_BAR_RADIUS, RIG_BAR_LENGTH, metal)
    bar.rotation_euler[1] = math.pi / 2
    for x in RIG_DROP_X:
        cylinder("Rig drop", (x, RIG_BAR_LOCATION[1], RIG_DROP_BOTTOM_Z), RIG_DROP_RADIUS, RIG_DROP_DEPTH, metal)

    for x in STAND_X:
        cylinder("Studio stand", (x, STAND_Y, STAND_HEIGHT / 2), STAND_RADIUS, STAND_HEIGHT, metal)
        cylinder("Studio stand foot", (x, STAND_Y, STAND_FOOT_Z), STAND_FOOT_RADIUS, STAND_FOOT_DEPTH, metal)
    cube("Softbox housing", SOFTBOX_LOCATION, SOFTBOX_SIZE, metal, 0.05)
    cube("Softbox diffuser", SOFTBOX_DIFFUSER_LOCATION, SOFTBOX_DIFFUSER_SIZE, simple_material("Diffuser", SOFTBOX_DIFFUSER_COLOUR, SOFTBOX_DIFFUSER_ROUGHNESS), 0.02)


def configure_world() -> None:
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputWorld")
    background = nodes.new("ShaderNodeBackground")
    environment = nodes.new("ShaderNodeTexEnvironment")
    environment.image = bpy.data.images.load(str(ASSET_ROOT / "hdri" / "brown_photostudio_02_1k.hdr"), check_existing=True)
    background.inputs["Strength"].default_value = WORLD_STRENGTH
    links.new(environment.outputs["Color"], background.inputs["Color"])
    links.new(background.outputs["Background"], output.inputs["Surface"])


def configure_camera() -> None:
    bpy.ops.object.camera_add(location=CAMERA_LOCATION)
    camera = bpy.context.object
    camera.name = "Hero camera"
    camera.data.lens = CAMERA_LENS_MM
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = None
    camera.data.dof.focus_distance = (Vector(CAMERA_LOCATION) - Vector(CAMERA_TARGET)).length
    camera.data.dof.aperture_fstop = CAMERA_F_STOP
    look_at(camera, CAMERA_TARGET)
    bpy.context.scene.camera = camera


def configure_key() -> None:
    bpy.ops.object.light_add(type="AREA", location=KEY_LOCATION)
    key = bpy.context.object
    key.name = "Warm key softbox"
    key.data.energy = KEY_ENERGY_WATTS
    key.data.shape = "DISK"
    key.data.size = KEY_SIZE_METRES
    key.data.color = KEY_COLOUR
    look_at(key, (0.0, 1.1, 0.8))


def configure_render(args) -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT" if args.samples == 0 else "CYCLES"
    scene.render.resolution_x = args.width
    scene.render.resolution_y = round(args.width / FRAME_ASPECT)
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.filepath = str(args.out)
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    scene.cycles.preview_samples = min(args.samples, 32)
    scene.render.threads_mode = "FIXED"
    scene.render.threads = CPU_THREADS
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = RENDER_EXPOSURE
    scene.view_settings.gamma = 1.0


def main() -> None:
    args = blender_arguments()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)

    plywood = pbr_material("Plywood PBR", "plywood")
    metal = pbr_material("Metal plate PBR", "metal_plate")
    sweep = simple_material("Warm sweep", SWEEP_COLOUR, SWEEP_ROUGHNESS)
    soil = simple_material("Garden soil", SOIL_COLOUR, 0.94)
    make_sweep(sweep)
    cube("Plywood garden board", BOARD_LOCATION, BOARD_SIZE, plywood, BOARD_BEVEL)
    cube("Soil on board", SOIL_LOCATION, SOIL_SIZE, soil, SOIL_BEVEL)
    plant_banks(import_plant_sources())
    studio_kit(metal)
    configure_world()
    configure_camera()
    configure_key()
    configure_render(args)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out.with_suffix(".blend")))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
