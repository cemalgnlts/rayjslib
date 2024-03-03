#!/bin/bash

# this is intended to run inside emscripten/emsdk docker

# if [ -x 'emsdk/upstream/emscripten/emcc' ]; then
# 	if [ ! -d "emsdk" ]; then
# 		# Get the emsdk repo
# 		git clone https://github.com/emscripten-core/emsdk.git
# 	fi

# 	# Enter that directory
# 	cd emsdk

# 	# Download and install the latest SDK tools.
# 	./emsdk install latest

# 	# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
# 	./emsdk activate latest

# 	# Activate PATH and other environment variables in the current terminal
# 	source ./emsdk_env.sh

# 	cd ..
# fi

mkdir -p build tools/api/

# rm -rf src/raylib
if [ ! -d "src/raylib" ]; then
	cd src
	git clone --branch master --depth 1 https://github.com/raysan5/raylib.git
	cd ..
fi

# rm -rf src/raygui
# if [ ! -d "src/raygui" ];then
# 	cd src/
# 	git clone --branch master --depth 1 https://github.com/raysan5/raygui.git
# 	cd ..
# fi

# rm -rf src/reasings
# if [ ! -d "src/reasings" ];then
# 	cd src
# 	git clone --branch main --depth 1 https://github.com/raylib-extras/reasings.git
# 	cd ..
# fi

# build JSON, ala RobLoach/raylib-api technique
make -C src/raylib/parser
./src/raylib/parser/raylib_parser -i src/raylib/src/raylib.h -o tools/api/raylib.json -f JSON -d RLAPI
# ./src/raylib/parser/raylib_parser -i src/raylib/src/rcamera.h -o tools/api/rcamera.json -f JSON -d RLAPI
# ./src/raylib/parser/raylib_parser -i src/raylib/src/raymath.h -o tools/api/raymath.json -f JSON -d RMAPI
# ./src/raylib/parser/raylib_parser -i src/raylib/src/rlgl.h -o tools/api/rlgl.json -f JSON -d RLAPI -t "RLGL IMPLEMENTATION"
# ./src/raylib/parser/raylib_parser -i src/raygui/src/raygui.h -o tools/api/raygui.json -f JSON -d RAYGUIAPI -t "RAYGUI IMPLEMENTATION"
# ./src/raylib/parser/raylib_parser -i src/reasings/src/reasings.h -o tools/api/reasings.json -f JSON -d EASEDEF
# ./src/raylib/parser/raylib_parser -i src/rmem/src/rmem.h -o tools/api/rmem.json -f JSON -d RMEMAPI -t "RMEM IMPLEMENTATION"
# ./src/raylib/parser/raylib_parser -i src/rres/src/rres.h -o tools/api/rres.json -f JSON -d RRESAPI -t "RRES IMPLEMENTATION"

if [ ! -d "src/raylib/build" ]; then
	cd src/raylib

	emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_EXAMPLES=Off -DPLATFORM="Web" \
		-DCUSTOMIZE_BUILD=On \
		-DSUPPORT_TRACELOG=Off \
		-DSUPPORT_SCREEN_CAPTURE=Off \
		-DSUPPORT_GIF_RECORDING=Off \
		-DSUPPORT_VR_SIMULATOR=Off \
		-DSUPPORT_SSH_KEYBOARD_RPI=0 \
		-DSUPPORT_FILEFORMAT_DDS=0 \
		-DSUPPORT_FILEFORMAT_HDR=0 \
		-DSUPPORT_FILEFORMAT_BMP=0 \
		-DSUPPORT_FILEFORMAT_QOI=0 \
		-DSUPPORT_FILEFORMAT_PSD=0 \
		-DSUPPORT_FILEFORMAT_FNT=0 \
		-DSUPPORT_MESH_GENERATION=0 \
		-DSUPPORT_FILEFORMAT_OBJ=0 \
		-DSUPPORT_FILEFORMAT_VOX=0 \
		-DSUPPORT_FILEFORMAT_MTL=0 \
		-DSUPPORT_FILEFORMAT_IQM=0 \
		-DSUPPORT_FILEFORMAT_GLTF=0 \
		-DSUPPORT_FILEFORMAT_M3D=0 \
		-DSUPPORT_FILEFORMAT_XM=0 \
		-DSUPPORT_FILEFORMAT_MOD=0 \
		-DSUPPORT_FILEFORMAT_QOA=0 \
		-DSUPPORT_MODULE_RMODELS=0
	
	cmake --build build
	cd ../..
fi

emcc src/raylib.c src/raylib/build/raylib/libraylib.a -o build/raylib.js -I src/raylib/src/ --no-entry \
	-DPLATFORM_WEB -O3 \
	-sEXPORT_KEEPALIVE=1 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=1 \
	-sMALLOC=emmalloc \
	-sUSE_ES6_IMPORT_META=0 \
	-sUSE_GLFW=3 \
	-sEXPORTED_RUNTIME_METHODS=stackSave,stackAlloc,stackRestore,writeArrayToMemory,stringToUTF8OnStack,FS \
	-sENVIRONMENT=web \
	-sEXPORTED_FUNCTIONS=@tools/exportedFunctions.json
