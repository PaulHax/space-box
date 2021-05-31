import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { Label } from "./label";

const MESH_SIZE = 10;
const PADDING = MESH_SIZE * 1.8;

export class Item {

    size = MESH_SIZE + PADDING;
    root: TransformNode;
    labelSlot: TransformNode;
    mesh: Mesh;
    material: StandardMaterial;
    labelText: Label;

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

        this.material = new StandardMaterial("itemMat", scene);
        this.material.diffuseColor = new Color3(1, 0, 1);
        this.material.specularColor = new Color3(0.5, 0.6, 0.87);
        this.material.emissiveColor = new Color3(.2, .1, .2);
        this.material.ambientColor = new Color3(0.23, 0.98, 0.53);

        box.material = this.material;

        this.mesh = box;
        
        this.labelSlot = new TransformNode("labelSlot", scene);
        this.labelSlot.position.z = -MESH_SIZE ;
        this.labelSlot.parent = this.root;
        const defaultText = Math.random().toString(36).substring(8).toUpperCase();
        this.labelText = new Label(defaultText);
        this.labelText.input.linkWithMesh(this.labelSlot);
    }

    set alpha(value: number) {
        this.material.alpha = value;
        this.labelText.input.alpha = value;
    }
}