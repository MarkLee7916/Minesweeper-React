import React, { useState } from "react";
import { useEffectAfterInitialisation } from "../hooks/useEffectAfterInitialisation";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { computeCountForGridItem, computeNeighbours, Coord, DEFAULT_BOMB_PROBABILITY, initialseGridWith, initBombGridWith as initBombGrid, NOT_DISCOVERED } from "../models/grid"
import { HashSet } from "../utility/hashset";
import { deepCopy } from "../utility/utils";
import { Grid } from "./Grid";
import { Menu } from "./Menu";
import { Modal } from "./Modal";

export const Game = () => {
    // Represents the flags on the grid where a tile has a flag if its value is true
    const [flagGrid, setFlagGrid] = useLocalStorageState(initialseGridWith(false), "flags");

    // Represents the number of bomb neighbours for each tile on the grid iff the tile has been discovered
    const [frontierGrid, setFrontierGrid] = useLocalStorageState(initialseGridWith(NOT_DISCOVERED), "frontiers");

    // Represents the bombs on the grid where a tile has a bomb if its value is true. Tiles are null until user makes a click
    const [bombGrid, setBombGrid] = useLocalStorageState(initialseGridWith(null), "bombs");

    // The probabilty of a tile having a bomb, expressed as a value out of 100
    const [bombProbability, setBombProbability] = useLocalStorageState(DEFAULT_BOMB_PROBABILITY.toString(), "bombprobabilty");

    // True when tutorial modal is on the screen, otherwise false
    const [isModalVisible, setModalVisibility] = useState(false);

    // True when user has hit a bomb, otherwise false
    const [isGameOver, setGameOver] = useLocalStorageState(false, "gameover");

    // Whenever user modifies bomb probability, reset bomb grid
    useEffectAfterInitialisation(() =>
        setBombGrid(initialseGridWith(null))
        , [bombProbability])

    // Reveal the frontier values at some coordinate, ends game if coordinate has a bomb
    function revealTileAt({ row, col }: Coord) {
        if (!hasBombGridBeenInitialised()) {
            const newBombGrid = initBombGrid(bombProbability, { row, col });

            setBombGrid(newBombGrid);
            revealNeighbouringTiles({ row, col }, newBombGrid, frontierGrid, new HashSet<Coord>());
        } else if (bombGrid[row][col]) {
            setGameOver(true);
        } else if (!flagGrid[row][col] && frontierGrid[row][col] === NOT_DISCOVERED && !isGameOver) {
            revealNeighbouringTiles({ row, col }, bombGrid, frontierGrid, new HashSet<Coord>());
        }
    }

    function hasBombGridBeenInitialised() {
        return !bombGrid.some(bombRow => bombRow.includes(null));
    }

    // If there's a flag at coord, remove it, else add one if it's a valid placement
    function toggleFlagAt({ row, col }: Coord) {
        if (!isGameOver) {
            setFlagGrid(flagGrid => {
                const flagGridCopy = deepCopy(flagGrid);

                if (canPlaceFlagAt(flagGridCopy, row, col)) {
                    flagGridCopy[row][col] = !flagGridCopy[row][col];
                }

                return flagGridCopy;
            });
        }
    }

    // Return true if tile hasn't been discovered and user hasn't used up all of their flags
    function canPlaceFlagAt(flagGridCopy: boolean[][], row: number, col: number) {
        return frontierGrid[row][col] === NOT_DISCOVERED &&
            (flagGridCopy[row][col] || (computeCountForGridItem(flagGrid, true) < computeCountForGridItem(bombGrid, true)));
    }

    // Update the display for the number of bomb neighbours at the given coord
    function setFrontierValAt({ row, col }: Coord, value: number) {
        setFrontierGrid(frontierGrid => {
            const frontierGridCopy = deepCopy(frontierGrid);

            frontierGridCopy[row][col] = value;

            return frontierGridCopy;
        });
    }

    // Recursively reveal the tiles around some coord. Will only trigger for neighbours if the coord has no bomb neighbours
    function revealNeighbouringTiles(coord: Coord, bombGrid: readonly boolean[][], frontierGrid: number[][], visited: HashSet<Coord>) {
        const adjacentBombCount = numberOfNeighboursWithBomb(coord, bombGrid);

        if (frontierGrid[coord.row][coord.col] === NOT_DISCOVERED && !visited.has(coord)) {
            visited.add(coord);
            handleReplacedFlag(coord);

            if (adjacentBombCount === 0) {
                setFrontierValAt(coord, 0);
                computeNeighbours(coord).forEach(neighbour => revealNeighbouringTiles(neighbour, bombGrid, frontierGrid, visited));
            } else {
                setFrontierValAt(coord, adjacentBombCount);
            }
        }
    }

    function handleReplacedFlag({ row, col }: Coord) {
        if (flagGrid[row][col]) {
            toggleFlagAt({ row, col });
        }
    }

    function numberOfNeighboursWithBomb(coord: Coord, bombGrid: readonly boolean[][]) {
        return computeNeighbours(coord).reduce((total: number, { row, col }: Coord) =>
            total + (bombGrid[row][col] ? 1 : 0)
            , 0);
    }

    function handleChangeInBombProbability(probabiltyStr: string) {
        const probability = parseInt(probabiltyStr);

        setBombProbability(probability);
        resetGame();
    }


    // Reset all of the games state to its default 
    function resetGame() {
        setFrontierGrid(initialseGridWith(NOT_DISCOVERED));
        setFlagGrid(initialseGridWith(false));
        setGameOver(false);
        setBombGrid(initialseGridWith(null));
    }

    return (
        <>
            <div id="page" style={{ opacity: isModalVisible ? "0.3" : "1" }}>
                <Menu
                    changeBombProbability={handleChangeInBombProbability}
                    bombProbability={bombProbability}
                    reset={resetGame}
                    showModal={() => setModalVisibility(true)}
                />
                <Grid
                    isGameOver={isGameOver}
                    bombGrid={bombGrid}
                    flagGrid={flagGrid}
                    frontierGrid={frontierGrid}
                    leftClickCallback={revealTileAt}
                    rightClickCallback={toggleFlagAt}
                />
            </div>

            <Modal isVisible={isModalVisible} hide={() => setModalVisibility(false)} />
        </>
    )
}
