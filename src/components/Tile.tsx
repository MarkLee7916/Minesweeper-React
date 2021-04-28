import React from "react";
import { Coord } from "../models/grid";
import { NOT_DISCOVERED, NO_BOMB_NEIGHBOURS } from "../models/grid";

interface Props {
    isGameOver: boolean
    hasBomb: boolean
    hasFlag: boolean
    frontierValue: number
    coord: Coord
    leftClickCallback: (coord: Coord) => void
    rightClickCallback: (coord: Coord) => void
}

const frontierValueToColor = new Map([
    [1, "#0074D9"],
    [2, "#FF4136"],
    [3, "#FFDC00"],
    [4, "#F012BE"],
    [5, "#7FDBFF"],
    [6, "#FF851B"],
    [7, "pink"],
    [8, "cyan"],
]);

const FLAG_SYMBOL = "🚩";

const CROSS_SYMBOL = "❌";

const BOMB_SYMBOL = "💣";

export const Tile = ({ isGameOver, hasBomb, hasFlag, frontierValue, coord, leftClickCallback, rightClickCallback }: Props) => {
    function getDisplaySymbol() {
        if (hasFlag && !hasBomb && isGameOver) {
            return CROSS_SYMBOL;
        } else if (!hasFlag && hasBomb && isGameOver) {
            return BOMB_SYMBOL;
        } else if (hasFlag) {
            return FLAG_SYMBOL;
        } else if (frontierValue !== NOT_DISCOVERED && frontierValue !== NO_BOMB_NEIGHBOURS) {
            return frontierValue.toString();
        } else {
            return "";
        }
    }

    function handleRightClick(event) {
        event.preventDefault();

        rightClickCallback(coord);
    }

    function handleLeftClick() {
        leftClickCallback(coord);
    }

    return (
        <td className="tile"
            style={{ color: frontierValueToColor.get(frontierValue), backgroundColor: frontierValue === NOT_DISCOVERED ? "white" : "#A9A9A9" }}
            onContextMenu={handleRightClick}
            onClick={handleLeftClick}
        >
            {getDisplaySymbol()}
        </td>
    )
}