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
# Back, and up, with the WHOLE SET in frame. The previous pass put the lens
# 170 mm off the floor on an 85 mm, which filled the frame with leaves and left
# nowhere for the picture to stop: no board end, no floor beyond, no edge of
# anything. A wider lens further back shows where the set finishes, which is
# what makes it read as a built set rather than as a photograph of a garden.
# 30 degrees down, looking INTO the bed rather than across it.
#
# The height follows from the angle, it is not a free choice. For the lens to
# stay pointed at the bed, tan(pitch) = (height - bed top) / distance, so 30
# degrees at 6.3 m back puts the camera at 3.84 m. Tilting to 30 and leaving
# the camera at 2.4 m would aim the axis at the floor two metres IN FRONT of
# the bed and shove the set up into the top of the frame.
CAMERA_DISTANCE = 6.3           # metres back from the board centre
CAMERA_HEIGHT = 3.84            # metres above the floor
CAMERA_PITCH_DEG = -30.0        # negative looks down
# 65 rather than 50. From 2.4 m a wide lens sweeps a long run of bare floor
# into the bottom of the frame; a longer one at the same height and framing
# shows about 0.75 m of floor in front of the bed instead of 1.8 m.
CAMERA_LENS_MM = 65.0
CAMERA_SENSOR_MM = 36.0
# Stopped down from 2.8. At this distance a wide aperture would hold nothing
# anyway, and the point of the shot is now that you can see the whole thing.
CAMERA_F_STOP = 3.5
CAMERA_FOCUS_Y = 0.0            # focus on the board centre line

# The sweep: one roll of seamless paper, floor into cove into wall. It is now
# NARROWER THAN THE FRAME on purpose. At 8 m half width it ran past both edges
# of the picture and became "the background". The wall stands 2.5 m further
# back than the bed, so it subtends much less than the frame does: at 1.95 m it
# shrank to a hanging banner with black either side. 2.90 m puts its cut edges
# just inside the frame at the wall while the floor runs off the sides, which
# is what a roll of paper actually looks like from in front of it.
SWEEP_HALF_WIDTH = 2.05
SWEEP_FLOOR_FRONT_Y = -3.2
SWEEP_COVE_START_Y = 1.6
SWEEP_COVE_RADIUS = 0.9
# Low enough that the TOP EDGE of the paper is in frame, with the roll above
# it and a band of dark studio over that. A backdrop that runs out of the top
# of the picture is a wall; one you can see the end of is a roll of paper.
SWEEP_WALL_HEIGHT = 1.80
# The scuff along the bottom. Paper that has been stood on is dirty where it
# meets the floor, and nothing says "this is a real roll" faster.
SWEEP_SCUFF_HEIGHT = 0.17
SWEEP_SCUFF = (0.21, 0.17, 0.10, 1.0)
# The roll itself, still on its bar above the wall.
ROLL_RADIUS = 0.085
ROLL_Z = 1.97

# The room the paper hangs in. Dark, so the lit paper reads as a thing with
# edges inside a larger darker space.
ROOM_SIZE = (15.0, 17.0, 6.0)
ROOM_ALBEDO = (0.032, 0.029, 0.026, 1.0)

# The key, as an object you can SEE. A softbox at the top left of frame, with
# its own stand under it. A light that is only ever an effect leaves the
# picture looking found; a light you can see in shot makes it a set.
# Beside the set rather than in front of it. At y = -1.25 it was a metre closer
# to the lens than the bed, so it blew up to a third of the frame width and the
# frame cut it in half at the corner.
SOFTBOX_CENTRE = (-1.30, -0.35, 1.34)
SOFTBOX_FACE = (0.85, 0.64)     # the diffusion panel, width by height
SOFTBOX_DEPTH = 0.46
SOFTBOX_YAW_DEG = -34.0         # swung to face the bed
SOFTBOX_PITCH_DEG = 22.0        # tipped down toward it

# A cable from the softbox stand, down and away across the paper.
CABLE_THICKNESS = 0.011
# The cable now crosses the whole floor, left to right. With the bed pushed
# left, the right half of the picture is bare paper, and a studio floor is not
# bare: it has the gear on it. This keeps that half dressed without putting
# anything leafy where the headline lands.
CABLE_RUN = [(-1.38, -0.44), (-1.48, -0.80), (-1.30, -1.15), (-0.75, -1.32),
             (0.10, -1.24), (0.80, -1.34), (1.70, -1.28)]
CABLE_TURNS = 2
CABLE_CENTRE = (1.15, -1.40)
CABLE_RADIUS = 0.17
SWEEP_ALBEDO = (0.63, 0.51, 0.30, 1.0)   # linear; roughly sRGB 0.87 0.81 0.61
SWEEP_ROUGHNESS = 0.85
SWEEP_TOOTH = 0.04                        # paper grain bump strength

# The garden board: a model base, plywood, standing on the floor.
# Shorter, and left of the axis. At 2.6 m wide and centred the bed ran to 76
# percent of the frame, so the headline had nowhere to land that was not
# leaves. At 2.0 m sitting left, both ends of the board are in shot and the
# right half of the picture is bare paper.
BOARD_WIDTH = 2.4
# The bed sits left of the lens axis. Looking 30 degrees down, the planting
# spreads across the whole frame and there is nowhere clean left for the
# headline; shifting the set left opens the right of the picture as bare paper,
# which is where the words land. Everything positioned relative to the bed adds
# this: the planting, the spill, the soil.
# Far enough left that the bed runs out of the left of the picture and its
# RIGHT end is the one you see. That is the end that matters: it is where the
# set stops, and everything to the right of it is bare paper for the words.
BOARD_X = -1.45
BOARD_DEPTH = 1.15              # a bed with rows behind rows, not a trough
BOARD_THICKNESS = 0.036
BOARD_BEVEL = 0.002
# The planter. A raised vegetable bed: timber sides standing proud of the soil,
# with posts at the corners. The sides ARE the boundary the downward tilt is
# there to show, and a flat board with soil on it has none.
PLANTER_WALL = 0.040            # board thickness
PLANTER_HEIGHT = 0.235          # how far the sides stand off the floor
PLANTER_POST = 0.072            # corner posts, square
PLANTER_POST_RISE = 0.045       # how far the posts stand proud of the boards
PLANTER_SOIL_DROP = 0.055       # soil surface below the top of the boards
PLANTER_BEVEL = 0.0025
TIMBER_ALBEDO = (0.106, 0.064, 0.032, 1.0)   # linear; a warm mid brown softwood
TIMBER_GRAIN = (0.062, 0.036, 0.018, 1.0)    # the darker streaks in it
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
# Shallower than it was. Seen from the old low lens the dip was a graceful
# saddle for the mark to hang into; seen from 2.4 m up it became a bare patch
# of soil between two clumps.
BANK_CENTRE_DROP = 0.80         # scale at dead centre, easing back to 1 at the dip edge
BANK_BREAK = 0.22               # slow variation along the bank, so the top is not an arc
# A low carpet across the whole bed, placed evenly and NOT scaled by the bank.
# Holding the centre and the right side down left bare board showing between
# two clumps, and the bed read as two separate plantings rather than one.
GROUND_COVER_COUNT = 460
GROUND_COVER_SCALE = (0.34, 0.60)
# Asymmetry. The copy arrives right of centre, so the right side stays lower
# and sparser and the weight sits left. Nothing here is a scrim behind the
# words: the words land on a part of the set that was built to be quiet.
PLANT_LEFT_BIAS = 0.25          # share of plants pushed toward the left half
# The copy lands on the right, and at 0.22 the planting came up to 38 percent
# of the frame and put the lead and the second button on top of leaves. At 0.50
# it went the other way and the bed ramped down from left to right like a
# slide. The drop also EASES OFF toward the far right edge, so the bed rises
# again at its end: tall left, dip for the mark, quiet middle right for the
# words, and a corner that closes the composition instead of trailing away.
RIGHT_DROP = 0.44               # how much shorter the right side runs
RIGHT_DROP_RECOVER = 0.45       # fraction of the drop given back at the far edge

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
SPILL_DEPTH = 0.85
# The litter spreads well past the right end of the board, out across the
# clean floor. Everything in the spill is placed relative to the bed, so this
# range is in bed coordinates and BOARD_X is added when it is placed.
SPILL_SPREAD = (-1.25, 2.75)              # how far in front of the board edge it reaches
SPILL_CRUMB_COUNT = 170
SPILL_CRUMB_RADIUS = (0.003, 0.007)
SPILL_SPECK_COUNT = 430         # fine soil dust close to the edge
SPILL_SPECK_RADIUS = (0.0008, 0.002)
SPILL_FROND = True

# The stands. The right one is close to the lens and out of focus; the left
# one is further back and reads sharper, which is what tells the eye the room
# has depth. A single stand in an empty corner looked like a prop.
# Pushed past the right edge of frame on purpose. A full height stand at 1.30
# ran straight down the right third, which is exactly where the headline and
# the buttons land: dark pole behind dark type. Only its arm and flag come into
# shot now, entering from the top right above the copy.
STAND_X = 2.25
STAND_Y = -0.55
STAND_HEIGHT = 2.6
STAND_RADIUS = 0.016
STAND_PAINT = (0.012, 0.012, 0.012, 1.0)
STAND_PAINT_ROUGHNESS = 0.45
SANDBAG_ALBEDO = (0.022, 0.019, 0.016, 1.0)
STAND_2_X = -2.05
STAND_2_Y = 1.30
# A third stand between the other two, so the rig reads as a rig rather than
# as a single lamp.
STAND_3 = (-1.58, 0.92, 2.3)    # x, y, height

# The step ladder, at the right hand edge. Its feet are in shot and the stiles
# run out of the top of the frame, which is what a ladder on a set does.
LADDER_POSITION = (1.58, 0.58)
LADDER_HEIGHT = 1.85
LADDER_SPREAD = 0.80            # foot to foot, front pair to back pair
LADDER_WIDTH = 0.52
LADDER_STEPS = 5
LADDER_ALBEDO = (0.055, 0.052, 0.048, 1.0)

# The trolley, on the floor in front of the bed and well below the headline.
CART_POSITION = (0.95, -1.05)
CART_SIZE = (0.44, 0.30, 0.52)
CART_TAPE = [(-0.10, 0.02), (-0.04, -0.05)]
TIN_OFFSET = (0.34, -0.16)
CLAMPS = [(-0.46, -0.22, 18.0), (-0.30, -0.33, -42.0)]
STAND_2_HEIGHT = 2.15
# The flag on its arm, entering top left. A black rectangle on a boom is the
# single most legible "this is a lit set" object there is, and it does the job
# the empty upper left of the old plate was not doing.
# The frame tops out near z = 0.87 at this camera, so the arm hangs at 0.78 or
# it is simply not in the picture, which is where the first pass put it.
# The arm hangs off the right hand stand and reaches back INTO the frame, so
# the flag is a thing on a stand. On its own knuckle in mid air it was a small
# black card floating in the middle of the picture, attached to nothing.
# Small, and in the corner. At 0.60 x 0.44 on a 0.86 m arm the panel landed in
# the middle of the frame at a third of its width and read as a wall-mounted
# television, which is the opposite of the job: a flag is an edge intrusion
# that tells you there is a rig overhead, not a subject.
# Smaller again, and far enough left that the frame cuts it. At 0.40 x 0.34 it
# survived the hero's `cover` crop as a featureless black rectangle a tenth of
# the picture wide, which reads as a hole in the image rather than as a flag.
# Swung well off the wall. Parallel to the backdrop the panel read as a dark
# rectangle painted onto the paper; at 38 degrees you see it is a board in the
# air with a stand holding it.
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
# The lamp you can SEE is a practical: it sets the direction and it is in the
# picture, but it is small and close, so on its own it burned a hot pool into
# the paper right under itself and left the bed in the dark. The work is done
# by FILL below, a big soft source off the camera's left shoulder, which is
# what the bounce board would be on a real set.
KEY_POWER_W = 170.0
KEY_COLOUR = (1.0, 0.95, 0.84)   # warm white, less magenta than a blackbody
KEY_SPREAD_DEG = 70.0
# Moved back and up, away from the softbox: from (-2.4, -0.2, 2.6) its cone
# grazed the softbox housing and lit the black skin to a pale grey, so the lamp
# in frame looked like a paper lampshade.
POOL_LOCATION = (-2.9, 0.4, 3.0)
# Aimed at the middle of the sweep, behind where the mark hangs, and tightened
# from 40 degrees to 26. A broad lamp lit the whole backdrop evenly, which is
# a flat wall; a pool puts the mark against light and lets the frame fall off
# into the corners on its own.
# Aimed at the WALL, not at the floor behind the bed. At z = 0.62 the cone
# landed on the cove where the planting hides it, which is why the backdrop
# stayed one flat wash however much the lamp was turned up.
POOL_TARGET = (-0.25, 2.55, 1.38)
POOL_POWER_W = 3200.0
POOL_KELVIN = 4600.0
POOL_CONE_DEG = 34.0
POOL_BLEND = 0.62
POOL_RADIUS = 0.4
# A small hard lamp low at the back right, raking toward the camera: it puts
# a shadow wedge under the plywood edge and a rim on the plant tops against
# the dark corner. Never on the backdrop.
KICK_LOCATION = (2.6, 0.8, 0.35)
KICK_TARGET = (0.0, -0.3, 0.05)
KICK_SIZE = 0.15
KICK_POWER_W = 150.0
KICK_KELVIN = 4000.0
# A soft wash across the RIGHT of the backdrop, which is the part of the set
# the headline lands on. Measured off the painted pixels, the paper there was
# #a09075, and the red word of the headline sat on it at 2.76:1 against the
# 3.0 that large text needs. The words are not going to be recoloured to suit
# the set; the set is lit so the words can sit on it.
BACKWASH_LOCATION = (2.6, -1.2, 2.9)
BACKWASH_TARGET = (1.15, 2.5, 1.15)
BACKWASH_SIZE = (1.8, 1.4)
BACKWASH_POWER_W = 900.0
BACKWASH_COLOUR = (1.0, 0.97, 0.90)

# The real key: large, far enough back to be even across the whole bed, and out
# of shot behind the camera's left shoulder.
FILL_LOCATION = (-2.2, -3.4, 2.5)
FILL_TARGET = (0.0, 0.1, 0.30)
FILL_SIZE = (2.8, 2.1)
FILL_POWER_W = 1200.0
FILL_COLOUR = (1.0, 0.96, 0.88)

WORLD_STRENGTH = 0.04
WORLD_ROTATION_DEG = 60.0

# Picture.
VIEW_TRANSFORM = "AgX"
VIEW_LOOK = "AgX - Punchy"
# Down a stop and a bit. The sweep is a large, light, diffuse surface, so it
# acts as a bounce for everything else: cutting the lamps individually barely
# moved the picture, because most of what lights the set is the paper.
EXPOSURE = -0.60
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


def emissive_material(name, colour, strength):
    """A surface that glows in shot. The softbox front was a plain diffuse
    panel, so the lamp read as a pale cube rather than as something switched
    on. It carries no light itself: the area light does that."""
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


def sweep_material():
    mat, nodes, links, bsdf = principled("Seamless paper")
    bsdf.inputs["Base Color"].default_value = SWEEP_ALBEDO
    # Dirt along the bottom, where the paper has been walked on. Driven by
    # world Z so it follows the cove up and stops, broken up by noise so the
    # edge of it is not a ruled line.
    geo = nodes.new("ShaderNodeNewGeometry")
    sep = nodes.new("ShaderNodeSeparateXYZ")
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[1].position = SWEEP_SCUFF_HEIGHT
    ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
    ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
    grime = nodes.new("ShaderNodeTexNoise")
    grime.inputs["Scale"].default_value = 11.0
    grime.inputs["Detail"].default_value = 6.0
    mul = nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = SWEEP_ALBEDO
    mix.inputs[7].default_value = SWEEP_SCUFF
    links.new(geo.outputs["Position"], sep.inputs["Vector"])
    links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], mul.inputs[0])
    links.new(grime.outputs["Fac"], mul.inputs[1])
    links.new(mul.outputs["Value"], mix.inputs["Factor"])
    links.new(mix.outputs[2], bsdf.inputs["Base Color"])
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


def timber_material():
    """Sawn softwood for the planter and the cart top. The plywood face
    material is pale birch, and at planter scale it read as painted MDF: the
    sides of the bed were the brightest thing in the lower half of the frame
    and pulled the eye off the planting they are supposed to contain."""
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
    """A planter: a raised vegetable bed with timber sides and corner posts.

    It used to be a flat board with a layer of soil laid on top, which from a
    low lens read as a scenic base and from a high one reads as nothing at all.
    A box you can see the walls of has a near edge, a far edge and four
    corners, and those edges are the boundary of the thing: that is what the
    downward tilt is for, and a flat slab gave it nothing to find."""
    wood = timber_material()

    def timber(name, centre, dims):
        return box(name, centre, dims, wood, PLANTER_BEVEL)

    hw, hd = BOARD_WIDTH / 2, BOARD_DEPTH / 2
    t, h = PLANTER_WALL, PLANTER_HEIGHT

    timber("Planter base", (BOARD_X, 0, BOARD_THICKNESS / 2),
           (BOARD_WIDTH, BOARD_DEPTH, BOARD_THICKNESS))
    # Front and back run the full width; the ends sit between them, which is
    # how the boards actually meet on a bed like this.
    timber("Planter front", (BOARD_X, -hd + t / 2, h / 2), (BOARD_WIDTH, t, h))
    timber("Planter back", (BOARD_X, hd - t / 2, h / 2), (BOARD_WIDTH, t, h))
    for side in (-1, 1):
        timber("Planter end", (BOARD_X + side * (hw - t / 2), 0, h / 2),
               (t, BOARD_DEPTH - 2 * t, h))
    # Corner posts, standing a little proud of the boards.
    for sx in (-1, 1):
        for sy in (-1, 1):
            timber("Planter post",
                   (BOARD_X + sx * (hw - PLANTER_POST / 2), sy * (hd - PLANTER_POST / 2),
                    (h + PLANTER_POST_RISE) / 2),
                   (PLANTER_POST, PLANTER_POST, h + PLANTER_POST_RISE))

    # The soil sits INSIDE the walls and a little below their top edge, so the
    # boards stand proud of it and read as sides rather than as a trim.
    soil_top = h - PLANTER_SOIL_DROP
    soil = box(
        "Soil",
        (BOARD_X, 0, soil_top - SOIL_THICKNESS / 2),
        (BOARD_WIDTH - 2 * t - 0.004, BOARD_DEPTH - 2 * t - 0.004, SOIL_THICKNESS),
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


def strut(name, a, b, radius, material, verts=12):
    """A cylinder running from point a to point b.

    Worth having: the first step ladder was built by placing cylinders at
    guessed centres and rotating them by a guessed angle, and it came out as an
    easel with grey panels floating between the legs."""
    a, b = Vector(a), Vector(b)
    d = b - a
    obj = cylinder(name, (a + b) / 2, radius, d.length, material, verts)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def ladder():
    """A step ladder, open, at the right hand edge of frame. Its feet are in
    shot and the stiles run out of the top, which is what a ladder on a set
    does; it is the tallest thing here and it gives the room a vertical."""
    paint = flat_material("Ladder", LADDER_ALBEDO, 0.72)
    x, y = LADDER_POSITION
    half, w, H = LADDER_SPREAD / 2, LADDER_WIDTH / 2, LADDER_HEIGHT

    # Two A-frames, front and back, meeting at the apex.
    for lean in (-half, half):
        for dy in (-w, w):
            strut("Ladder stile", (x + lean, y + dy, 0.0), (x, y + dy, H), 0.019, paint)

    # Treads on the front pair only, each sitting where those stiles are at
    # that height, so they actually touch the legs they are fixed to.
    for i in range(LADDER_STEPS):
        f = (i + 1) / (LADDER_STEPS + 1)
        z = H * (1.0 - f)
        tx = x - half * (1.0 - z / H)
        box("Ladder tread", (tx, y, z + 0.011), (0.155, LADDER_WIDTH, 0.022), paint, 0.004)

    # The spreader bar that stops it opening further.
    zb = H * 0.42
    strut("Ladder spreader", (x - half * (1 - zb / H), y, zb),
          (x + half * (1 - zb / H), y, zb), 0.008, paint, 8)


def cart():
    """A trolley of gear, and what gets left on the paper around it: tape,
    a tin, a couple of clamps. All of it low, and all of it well below the
    headline, so the right of the frame is dressed without being busy."""
    steel = flat_material("Cart steel", (0.045, 0.045, 0.048, 1.0), 0.42, metallic=1.0)
    ply = timber_material()
    x, y = CART_POSITION
    w, d, h = CART_SIZE

    box("Cart top", (x, y, h), (w, d, 0.028), ply, 0.004)
    box("Cart shelf", (x, y, h * 0.42), (w - 0.06, d - 0.06, 0.022), ply, 0.004)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cylinder("Cart leg", (x + sx * (w / 2 - 0.04), y + sy * (d / 2 - 0.04), h / 2),
                     0.012, h, steel, 10)
            cylinder("Cart castor", (x + sx * (w / 2 - 0.04), y + sy * (d / 2 - 0.04), 0.022),
                     0.022, 0.016, steel, 12).rotation_euler = (math.radians(90), 0, 0)

    rubber = flat_material("Tape", (0.02, 0.02, 0.021, 1.0), 0.7)
    for i, (dx, dy) in enumerate(CART_TAPE):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.052, minor_radius=0.021,
                                         major_segments=40, minor_segments=12,
                                         location=(x + dx, y + dy, h + 0.049))
        t = bpy.context.object
        t.name = f"Tape {i}"
        t.data.materials.append(rubber)
        smooth(t)
    tin = cylinder("Paint tin", (x + TIN_OFFSET[0], y + TIN_OFFSET[1], 0.072), 0.075, 0.144,
                   flat_material("Tin", (0.30, 0.29, 0.27, 1.0), 0.3, metallic=1.0), 28)
    tin.rotation_euler = (0.0, 0.0, 0.0)
    for dx, dy, rot in CLAMPS:
        c = box("Clamp", (x + dx, y + dy, 0.016), (0.11, 0.035, 0.032), steel, 0.006)
        c.rotation_euler = (0.0, 0.0, math.radians(rot))


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
        edge = 1.0 - (1.0 - u) ** 1.35         # pushed outward
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
        if x <= 0:
            return m
        # The drop is full across the middle right and eases off toward the
        # edge, so the bed closes rather than ramping away off the frame.
        return m * (1.0 - RIGHT_DROP * (1.0 - RIGHT_DROP_RECOVER * t ** 2.4))

    # The carpet goes down first, so the taller planting sits into it rather
    # than on top of it. It takes no bank multiplier: its whole job is to make
    # sure no patch of board is ever bare, including where the bank is held
    # down for the mark and for the copy.
    for _ in range(GROUND_COVER_COUNT):
        place(sources, "grass", rng, (rng.uniform(-hw, hw) + BOARD_X, y_pick(), soil_top - 0.002),
              rng.uniform(*GROUND_COVER_SCALE), rng.uniform(0, math.tau))

    for kind, count, scale in (
        ("boulder", BOULDER_COUNT, BOULDER_SCALE),
        ("branch", BRANCH_COUNT, BRANCH_SCALE),
        ("fern", FERN_COUNT, FERN_SCALE),
        ("celandine", CELANDINE_COUNT, CELANDINE_SCALE),
        ("grass", GRASS_COUNT, GRASS_SCALE),
    ):
        for _ in range(count):
            # x is local to the bed, because bank() and the left/right bias are
            # both defined across the bed. BOARD_X is added only when the thing
            # is actually placed in the room.
            x = x_pick()
            y = y_pick()
            z = soil_top - (0.01 if kind == "boulder" else 0.002)
            size = rng.uniform(*scale) * (1.0 if kind == "boulder" else bank(x))
            place(sources, kind, rng, (x + BOARD_X, y, z), size, rng.uniform(0, math.tau))


def spill(sources):
    rng = random.Random(RANDOM_SEED + 1)
    edge_y = -BOARD_DEPTH / 2
    crumb = flat_material("Crumb", SOIL_ALBEDO, 0.95)
    for _ in range(SPILL_GRASS_COUNT):
        d = rng.random() ** 0.8 * SPILL_DEPTH
        x = rng.uniform(*SPILL_SPREAD) + BOARD_X
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
        place(sources, "fern", rng, (-0.35 + BOARD_X, edge_y - 0.09, 0.004), 0.17, math.radians(200), tilt=(math.radians(88), 0.0))
        for _ in range(SPILL_FROND_COUNT - 1):
            place(
                sources,
                "fern",
                rng,
                (rng.uniform(*SPILL_SPREAD) + BOARD_X, edge_y - 0.02 - rng.random() ** 2 * SPILL_DEPTH, 0.004),
                rng.uniform(0.16, 0.24),
                rng.uniform(0, math.tau),
                tilt=(math.radians(rng.uniform(80, 90)), 0.0),
            )
    for _ in range(SPILL_TWIG_COUNT):
        place(
            sources,
            "branch",
            rng,
            (rng.uniform(*SPILL_SPREAD) + BOARD_X, edge_y - 0.02 - rng.random() ** 1.5 * SPILL_DEPTH, 0.002),
            rng.uniform(*SPILL_TWIG_SCALE),
            rng.uniform(0, math.tau),
        )
    for count, radius, reach_power in (
        (SPILL_CRUMB_COUNT, SPILL_CRUMB_RADIUS, 2.2),
        (SPILL_SPECK_COUNT, SPILL_SPECK_RADIUS, 3.0),
    ):
        for _ in range(count):
            d = rng.random() ** reach_power * SPILL_DEPTH
            x = rng.uniform(*SPILL_SPREAD) + BOARD_X
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


def room():
    """A dark box around everything. The paper is now narrower than the frame,
    so something has to be behind and beside it, and a dim studio is what makes
    the lit paper read as an object with edges rather than as the background."""
    dark = flat_material("Room", ROOM_ALBEDO, 0.92)
    w, d, h = ROOM_SIZE
    shell = box("Room", (0.0, 1.0, h / 2 - 0.9), (w, d, h), dark)
    # The camera stands inside it, so the inward faces are what gets shaded.
    shell.data.flip_normals() if hasattr(shell.data, "flip_normals") else None


def paper_roll():
    """The roll still on its bar, above the top of the wall."""
    roll = cylinder("Paper roll", (0.0, SWEEP_COVE_START_Y + SWEEP_COVE_RADIUS + ROLL_RADIUS,
                                   ROLL_Z), ROLL_RADIUS, SWEEP_HALF_WIDTH * 2 + 0.16,
                    sweep_material(), 40)
    roll.rotation_euler = (0.0, math.radians(90), 0.0)
    bar = cylinder("Roll bar", (0.0, SWEEP_COVE_START_Y + SWEEP_COVE_RADIUS + ROLL_RADIUS,
                                ROLL_Z), 0.016, SWEEP_HALF_WIDTH * 2 + 0.52,
                   flat_material("Roll bar", (0.6, 0.6, 0.6, 1.0), 0.3, metallic=1.0), 20)
    bar.rotation_euler = (0.0, math.radians(90), 0.0)


def softbox():
    """The key, built as the thing that makes it: a black housing, a diffusion
    panel, and the area light sitting on that panel so what you see in frame and
    what lights the set are the same object."""
    cx, cy, cz = SOFTBOX_CENTRE
    yaw, pitch = math.radians(SOFTBOX_YAW_DEG), math.radians(SOFTBOX_PITCH_DEG)
    rot = Matrix.Rotation(yaw, 4, "Z") @ Matrix.Rotation(pitch, 4, "X")

    fw, fh = SOFTBOX_FACE
    housing = box("Softbox housing", (0, 0, 0), (fw * 1.02, SOFTBOX_DEPTH, fh * 1.02),
                  flat_material("Softbox skin", (0.004, 0.004, 0.005, 1.0), 0.94), 0.012)
    housing.matrix_world = Matrix.Translation((cx, cy, cz)) @ rot @ housing.matrix_world

    panel = box("Softbox diffusion", (0, -SOFTBOX_DEPTH / 2 - 0.012, 0), (fw, 0.02, fh),
                flat_material("Diffusion", (0.88, 0.86, 0.82, 1.0), 0.62))
    panel.matrix_world = Matrix.Translation((cx, cy, cz)) @ rot @ panel.matrix_world

    # The stand under it, and a sandbag on the leg facing us.
    paint = flat_material("Softbox stand", STAND_PAINT, STAND_PAINT_ROUGHNESS)
    cylinder("Softbox riser", (cx, cy + 0.12, (cz - fh / 2) / 2), 0.019, cz - fh / 2, paint)
    for a_deg in (210, 330, 90):
        a, tilt, length = math.radians(a_deg), math.radians(74), 0.46
        half = length / 2
        leg = cylinder("Softbox leg", (
            cx + half * math.sin(tilt) * math.cos(a),
            cy + 0.12 + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt),
        ), 0.013, length, paint, 16)
        leg.rotation_euler = (0.0, tilt, a)

    return Vector((cx, cy, cz)), rot


def cable():
    """A cable snaking away from the stand and ending in a coil. Seen from a
    metre up with a down angle it reads as cable; the previous attempt put it
    under a 170 mm lens where it collapsed into a flat ellipse."""
    rubber = flat_material("Cable", (0.006, 0.006, 0.007, 1.0), 0.78)
    for (x0, y0), (x1, y1) in zip(CABLE_RUN, CABLE_RUN[1:]):
        dx, dy = x1 - x0, y1 - y0
        length = math.hypot(dx, dy)
        seg = cylinder("Cable run", ((x0 + x1) / 2, (y0 + y1) / 2, CABLE_THICKNESS),
                       CABLE_THICKNESS, length, rubber, 14)
        seg.rotation_euler = (0.0, math.radians(90), math.atan2(dy, dx))
    for i in range(CABLE_TURNS):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=CABLE_RADIUS - i * 0.045,
            minor_radius=CABLE_THICKNESS,
            major_segments=56, minor_segments=12,
            location=(CABLE_CENTRE[0] + i * 0.015, CABLE_CENTRE[1] - i * 0.012,
                      CABLE_THICKNESS),
        )
        coil = bpy.context.object
        coil.name = "Cable coil"
        coil.data.materials.append(rubber)
        smooth(coil)


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

    x3, y3, h3 = STAND_3
    cylinder("Stand 3 riser", (x3, y3, h3 / 2), STAND_RADIUS * 0.85, h3, paint)
    cylinder("Stand 3 collar", (x3, y3, 0.88), STAND_RADIUS * 1.6, 0.042, chrome)
    for a_deg in (190, 310, 70):
        a, tilt, length = math.radians(a_deg), math.radians(76), 0.32
        half = length / 2
        leg = cylinder("Stand 3 leg", (
            x3 + half * math.sin(tilt) * math.cos(a),
            y3 + half * math.sin(tilt) * math.sin(a),
            0.03 + half * math.cos(tilt),
        ), 0.0095, length, paint, 14)
        leg.rotation_euler = (0.0, tilt, a)

    # A small head clamped in at the top right corner, body dark and its front
    # catching light, to balance the softbox at the other side of the frame.

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


def key(box_origin, box_rot):
    """The key sits ON the softbox's diffusion panel, so the light in the
    picture and the light doing the work are one object. It used to be an
    invisible area light somewhere off to the left, which is exactly the kind
    of lighting that leaves a set looking like a photograph of a garden.

    The separate top flag is gone with it: the softbox is now inside the frame
    and below the top of the wall, so it no longer spills onto the backdrop the
    way a lamp hung above the frame line did."""
    panel = box_origin + box_rot @ Vector((0.0, -SOFTBOX_DEPTH / 2 - 0.03, 0.0))
    bpy.ops.object.light_add(type="AREA", location=panel)
    k = bpy.context.object
    k.name = "Key softbox"
    k.data.shape = "RECTANGLE"
    k.data.size, k.data.size_y = SOFTBOX_FACE
    k.data.energy = KEY_POWER_W
    k.data.spread = math.radians(KEY_SPREAD_DEG)
    k.data.color = KEY_COLOUR
    k.rotation_euler = (Vector(KEY_TARGET) - panel).to_track_quat("-Z", "Y").to_euler()

    bpy.ops.object.light_add(type="AREA", location=FILL_LOCATION)
    f = bpy.context.object
    f.name = "Fill"
    f.data.shape = "RECTANGLE"
    f.data.size, f.data.size_y = FILL_SIZE
    f.data.energy = FILL_POWER_W
    f.data.spread = math.radians(110.0)
    f.data.color = FILL_COLOUR
    f.rotation_euler = (Vector(FILL_TARGET) - Vector(FILL_LOCATION)).to_track_quat("-Z", "Y").to_euler()

    bpy.ops.object.light_add(type="AREA", location=BACKWASH_LOCATION)
    bw = bpy.context.object
    bw.name = "Backdrop wash"
    bw.data.shape = "RECTANGLE"
    bw.data.size, bw.data.size_y = BACKWASH_SIZE
    bw.data.energy = BACKWASH_POWER_W
    bw.data.spread = math.radians(95.0)
    bw.data.color = BACKWASH_COLOUR
    bw.rotation_euler = (Vector(BACKWASH_TARGET) - Vector(BACKWASH_LOCATION)).to_track_quat("-Z", "Y").to_euler()

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
    tag("back", spill, sources)
    tag("back", stand)
    tag("back", studio)
    tag("back", room)
    tag("back", paper_roll)
    box_origin, box_rot = tag("back", softbox)
    tag("back", ladder)
    tag("back", cart)
    tag("back", cable)
    world()
    key(box_origin, box_rot)
    camera()
    isolate(args.layer)
    render(args)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out.with_suffix(".blend")))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
