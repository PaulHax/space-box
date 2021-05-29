import { Color3, GroundBuilder, Scene } from "@babylonjs/core"
import { GridMaterial } from '@babylonjs/materials/Grid';

export const createSetting = (size: number, scene: Scene): void  => {
    // Our built-in 'ground' shape.
    const ground = GroundBuilder.CreateGround(
        "ground",
        { width: size, height: size },
        scene
    );

    const groundMaterial = new GridMaterial("groundMaterial", scene);
	groundMaterial.majorUnitFrequency = 5;
	groundMaterial.minorUnitVisibility = 0.45;
	groundMaterial.gridRatio = 10;
	groundMaterial.mainColor = new Color3(1, 0, 1);
	groundMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.4;
    groundMaterial.fogEnabled = true;

    ground.material = groundMaterial;

}