import { deepCopy, randomProbabilty } from "../utility/utils";

export type Coord = { row: number, col: number }

const TOTAL_DIMENSION = 50;

export const HEIGHT = computeDimensionRatios(TOTAL_DIMENSION, window.innerHeight);

export const WIDTH = computeDimensionRatios(TOTAL_DIMENSION, window.innerWidth);

export const NOT_DISCOVERED = -1;

export const NO_BOMB_NEIGHBOURS = 0;

export const DEFAULT_BOMB_PROBABILITY = 15;

// Initialise a grid of dimensions HEIGHT x WIDTH with some value
export function initialseGridWith<T>(input: T): T[][] {
    const grid = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            grid[row].push(deepCopy(input));
        }
    }

    return grid;
}

// Initialise a grid of bombs, where each tile has some probability of being a bomb
export function initBombGridWith(probability: number, exclusion: Coord) {
    const grid = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            if (row === exclusion.row && col === exclusion.col) {
                grid[row].push(false);
            } else {
                grid[row].push(randomProbabilty(probability));
            }
        }
    }

    return grid;
}

// Return all adjacent positions including positions that are diagonally adjacent
export function computeNeighbours({ row, col }: Coord) {
    const neighbours = [];

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if ((i !== 0 || j !== 0) && isOnGrid(row + i, col + j)) {
                neighbours.push({ row: row + i, col: col + j });
            }
        }
    }

    return neighbours;
}

// Return the number of appearances of some value in a grid
export function computeCountForGridItem<T>(grid: readonly T[][], item: T) {
    return grid.reduce(
        (gridTotal, row) => gridTotal + row.reduce(
            (rowTotal, tile) => rowTotal + (tile === item ? 1 : 0)
            , 0)
        , 0);
}

function isOnGrid(row: number, col: number) {
    return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
}

// Calculate height and width based off of the size of the users screen
function computeDimensionRatios(totalSize: number, screenDimension: number) {
    const totalScreenLength = window.innerHeight + window.innerWidth;

    return Math.round(screenDimension / totalScreenLength * totalSize);
}