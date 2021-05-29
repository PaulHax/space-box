import earcut from "earcut";
import { MeshBuilder, Path2, Scene, TransformNode, Vector3 } from "@babylonjs/core";

const THICKNESS = 2;
const CORNER_SEGMENTS = 36;

const DEPTH = 20;

export class Container {

    constructor(scene: Scene) {

        const root = new TransformNode("root");
        
        const width = 100;
        const heigth = 50;
        const shape = Container.makeBevelledRectangle(width, heigth);
        const hole = Container.makeBevelledRectangle(width - THICKNESS, heigth - THICKNESS);

        // Center cutout by translating right and down
        const offset = THICKNESS / 2;
        for(const point of hole) {
            point.x += offset;
            point.z -= offset;
        }

        const wall = MeshBuilder.ExtrudePolygon(
            "wall", 
            {
                shape,
                holes: [hole],
                depth: DEPTH
            }, 
            scene,
            earcut
        );
        wall.position.y = DEPTH;

        wall.parent = root;
    }

    static makeBevelledRectangle(width: number, height: number, cornerRadiusRatio = .02): Vector3[] {
        const squareSize = width;
        const cornerSize = width * cornerRadiusRatio;
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
