import earcut from "earcut";
import { Color3, Mesh, MeshBuilder, Path2, PlaneDragGizmo, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { Item } from "./item";

const THICKNESS = 2;
const CORNER_SIZE = 2;
const CORNER_SEGMENTS = 36;
const DEPTH = 3;
const HANDLE_RADIUS = 5;
const HANDLE_PADDING = -1;

const DEFAULT_MIN_SIZE = 10;

export class Container {

    private scene: Scene;
    private root: TransformNode;
    private wall: Mesh;
    private handle: TransformNode;
    private items: Item[] = [];
    private minimumSize = DEFAULT_MIN_SIZE;
    private size = { width: 100, height: 50 }

    constructor(scene: Scene) {
        this.scene = scene;

        this.root = new TransformNode("root", scene);

        this.handle = MeshBuilder.CreateSphere("containerHandle", { diameter: HANDLE_RADIUS * 2 }, scene);
        this.handle.parent = this.root
        this.fitHandleToSize();

        const gizmo = new PlaneDragGizmo(new Vector3(0, 1, 0), new Color3(0.8, 0.4, 0.3));
        gizmo.attachedNode = this.handle;
        gizmo.updateScale = false;
        const gizMesh = MeshBuilder.CreateSphere(
            "containerHandle",
            { diameter: HANDLE_RADIUS * 2 },
            gizmo.gizmoLayer.utilityLayerScene
        )
        const gizMaterial = new StandardMaterial("myMaterial", gizmo.gizmoLayer.utilityLayerScene);
        gizMaterial.alpha = 0;
        gizMesh.material = gizMaterial;
        gizmo.setCustomMesh(gizMesh)

        gizmo.dragBehavior.onDragObservable.add(() => {
            this.scaleByHandle();
        })

        this.wall = this.scaleByHandle();
    }

    scaleByHandle(): Mesh {
        const { x, z } = this.handle.position;

        // clamp to minimum size
        const targetWidth = x - HANDLE_PADDING - HANDLE_RADIUS;
        const targetHeight = -z - HANDLE_PADDING - HANDLE_RADIUS;

        const width = Math.max(targetWidth, this.minimumSize);
        this.handle.position.x = x + width - targetWidth;

        const height = Math.max(targetHeight, this.minimumSize);
        this.handle.position.z = z + targetHeight - height;

        return this.setSize(width, height);
    }

    setSize(width: number, height: number): Mesh {
        this.size.width = width;
        this.size.height = height;

        this.positionItems();

        // Remake outer wall
        if (this.wall) {
            this.wall.dispose();
        }

        const shape = Container.makeBevelledRectangle(width, height);
        const hole = Container.makeBevelledRectangle(width - THICKNESS, height - THICKNESS);

        // Center cutout by translating right and down
        const offset = THICKNESS / 2;
        for (const point of hole) {
            point.x += offset;
            point.z -= offset;
        }

        this.wall = MeshBuilder.ExtrudePolygon(
            "wall",
            {
                shape,
                holes: [hole],
                depth: DEPTH,
            },
            this.scene,
            earcut
        );

        this.wall.position.y = DEPTH;
        this.wall.parent = this.root;

        return this.wall;
    }

    fitHandleToSize(): void {
        const { width, height } = this.size;
        this.handle.position.set(
            width + HANDLE_PADDING + HANDLE_RADIUS,
            DEPTH / 2,
            -height - HANDLE_PADDING - HANDLE_RADIUS
        )
    }

    setItems(items: Item[]): void {
        this.items = items;
        const { length: itemCount } = items;
        if (itemCount !== 0) {
            const { size: itemSize } = items[0];
            this.minimumSize = itemSize + 2 * THICKNESS

            const columns = Math.min(itemCount, 10);
            const rows = Math.ceil(itemCount / 10);
            this.setSize(columns * itemSize + 2 * THICKNESS, rows * itemSize + 2 * THICKNESS);
            this.fitHandleToSize();
        } else {
            this.minimumSize = DEFAULT_MIN_SIZE;
        }
    }

    private positionItems(): void {
        if (this.items.length !== 0) {
            const itemSize = this.items[0].size;
            const { width, height } = this.size;

            const xInnerSpace = width - 2 * THICKNESS;
            const maxColumns = Math.floor(xInnerSpace / itemSize);
            const columnsNeeded = this.items.length;
            const columns = Math.min(maxColumns, columnsNeeded);

            const zInnerSpace = height - 2 * THICKNESS;
            const maxRows = Math.floor(zInnerSpace / itemSize);
            const rowsNeeded = Math.ceil(this.items.length / columns);
            const rows = Math.min(maxRows, rowsNeeded);

            const xStart = itemSize / 2 + THICKNESS;
            const zStart = -xStart;

            let itemIndex = 0;
            for (let row = 0; row < rows && itemIndex < this.items.length; row++) {
                for (let column = 0; column < columns && itemIndex < this.items.length; column++, itemIndex++) {
                    const { position } = this.items[itemIndex].root;
                    const { material } = this.items[itemIndex].mesh;
                    position.x = column * itemSize + xStart;
                    position.y = 0;
                    position.z = row * -itemSize + zStart;
                    if (material) {
                        material.alpha = 1;
                    }
                }
            }

            // stack the rest and fade out
            for (let stackIndex = 1; itemIndex < this.items.length; itemIndex++, stackIndex++) {
                const { position } = this.items[itemIndex].root;
                const { material } = this.items[itemIndex].mesh;
                position.x = xStart;
                position.z = zStart;
                position.y = itemSize * stackIndex;
                if (material) {
                    material.alpha = 2 / stackIndex;
                }
            }
        }
    }

    static makeBevelledRectangle(width: number, height: number): Vector3[] {
        const squareSize = width;
        const cornerSize = CORNER_SIZE;
        const xStraightLength = width - cornerSize;
        const yStraightLength = height - cornerSize;
        const bevelMidPoint = cornerSize * Math.sin(Math.PI / 4) * 2.0;

        const path = new Path2(0, -cornerSize);
        path.addLineTo(0, -yStraightLength);
        path.addArcTo(bevelMidPoint, -height, cornerSize, -height, CORNER_SEGMENTS);
        path.addLineTo(xStraightLength, -height);
        path.addArcTo(squareSize, bevelMidPoint - height, squareSize, -yStraightLength, CORNER_SEGMENTS);
        path.addLineTo(squareSize, -cornerSize);
        path.addArcTo(width - bevelMidPoint, 0, xStraightLength, 0, CORNER_SEGMENTS);
        path.addLineTo(cornerSize, 0);
        path.addArcTo(0, -bevelMidPoint, 0, -cornerSize, CORNER_SEGMENTS);

        return path.getPoints().map(v => new Vector3(v.x, 0, v.y));
    }

}
