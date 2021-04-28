import React from "react";
import { Coord } from "../models/grid";
import { Tile } from "./Tile";

interface Props {
    isGameOver: boolean
    bombGrid: readonly boolean[][];
    flagGrid: boolean[][]
    frontierGrid: number[][]
    leftClickCallback: (coord: Coord) => void
    rightClickCallback: (coord: Coord) => void
}

export const Grid = ({ isGameOver, bombGrid, flagGrid, frontierGrid, leftClickCallback, rightClickCallback }: Props) => {
    function renderRow(row: boolean[], rowIndex: number) {
        return (
            <tr className="row" key={rowIndex}>
                {row.map((hasFlag, colIndex) =>
                    <Tile
                        key={colIndex}
                        isGameOver={isGameOver}
                        hasBomb={bombGrid[rowIndex][colIndex]}
                        hasFlag={hasFlag}
                        coord={{ row: rowIndex, col: colIndex }}
                        frontierValue={frontierGrid[rowIndex][colIndex]}
                        leftClickCallback={leftClickCallback}
                        rightClickCallback={rightClickCallback}
                    />
                )}
            </tr>
        );
    }

    return (
        <table id="grid">
            <tbody>
                {flagGrid.map((row, index) => renderRow(row, index))}
            </tbody>
        </table>
    );
}