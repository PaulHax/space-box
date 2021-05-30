import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";

const MESH_SIZE = 10;
const PADDING = MESH_SIZE / 2;

export class Item {

    size = MESH_SIZE + PADDING;
    root: TransformNode;
    mesh: Mesh;

    constructor(scene: Scene) {

        const root = new TransformNode("root", scene);
        this.root = root;

        const box = MeshBuilder.CreateBox(
            "item",
            {
                height: MESH_SIZE,
                width: MESH_SIZE,
                depth: MESH_SIZE
            },
            scene,
        );
        box.parent = root;

        // Move the sphere upward 1/2 its height
        box.position.y = MESH_SIZE / 2;

        const myMaterial = new StandardMaterial("itemMat", scene);
        myMaterial.diffuseColor = new Color3(1, 0, 1);
        myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
        myMaterial.emissiveColor = new Color3(.1, .1, .1);
        myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);

        box.material = myMaterial;

        this.mesh = box;
    }
}