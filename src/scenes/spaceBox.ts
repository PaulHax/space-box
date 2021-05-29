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
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { createSetting } from "../shared/settingBuilder";
import { GlowLayer } from "@babylonjs/core";
import { Container } from "../shared/container";

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

        const gl = new GlowLayer("glow", scene);

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

        const sphere = SphereBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            scene
        );

        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;

        const myMaterial = new StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = new  Color3(1, 0, 1);
        myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
        myMaterial.emissiveColor = new Color3(.1, .1, .1);
        myMaterial.ambientColor = new  Color3(0.23, 0.98, 0.53);
        
        sphere.material= myMaterial;

        const container = new Container(scene);

        return scene;
    };
}

export default new SpaceBox();