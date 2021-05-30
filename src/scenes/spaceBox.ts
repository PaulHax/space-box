import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

// If you don't need the standard material you will still need to import it since the scene requires it.
StandardMaterial
// import "@babylonjs/core/Materials/standardMaterial";
// import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { createSetting } from "../shared/settingBuilder";
import { GlowLayer } from "@babylonjs/core";
import { Container } from "../shared/container";
import { Item } from "../shared/item";

export class SpaceBox implements CreateSceneClass {

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // scene.fogMode = Scene.FOGMODE_EXP;
        // scene.fogColor = new Color3(0.9, 0.9, 0.85);
        // scene.fogDensity = 0.1;
        scene.clearColor = new Color4(0.1, 0.05, 0.2);
        
        scene.fogMode = Scene.FOGMODE_EXP;
        scene.fogDensity = 0.0015;
        scene.fogColor = new Color3(0.1, 0.05, 0.2);

        const glowLayer = new GlowLayer("glow", scene);

        const camera = new ArcRotateCamera("orbiter", -1.5, 0.5, 300, Vector3.Zero(), scene);
        camera.wheelPrecision = 1;
        camera.panningSensibility = 50;
        camera.lowerRadiusLimit = 50;
        camera.upperRadiusLimit = 500;
        camera.upperBetaLimit = Math.PI / 3;

        scene.registerBeforeRender(() => {
            camera.target.y = 0;
        });

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        createSetting(5000, scene);

        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 0.7;

        const items = Array.from({ length:50 }, () => (new Item(scene)));
        const container = new Container(scene);
        container.setItems(items);

        return scene;
    };
}

export default new SpaceBox();