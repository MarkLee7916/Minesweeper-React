import React, { useState } from "react"
import Switch from "react-switch"
import { isTouchscreen } from "../utility/utils";

interface Props {
    showModal: () => void
    changeBombProbability: (probabilityStr: string) => void
    bombProbability: number
    reset: () => void
    isLeftClickRevealing: boolean
    switchPlacementType: () => void
}

export const Menu = ({ showModal, changeBombProbability, bombProbability, reset, isLeftClickRevealing, switchPlacementType }: Props) => {
    function handleChangeInBombProbability(event) {
        changeBombProbability(event.target.value);
    }

    // Resize grid by clearing local storage and refreshing the browser
    function resizeGrid() {
        localStorage.clear();
        location.reload();
    }

    return (
        <>
            <div className="menu">
                <div className="slider-container">
                    <span>Bomb probability per tile:</span>

                    <input type="range"
                        onChange={handleChangeInBombProbability}
                        min={0}
                        max={100}
                        defaultValue={bombProbability}
                    />

                    <span>{bombProbability}%</span>
                </div>

                <button onClick={reset}>Reset Game</button>

                <button onClick={resizeGrid}>Resize Grid</button>

                <button onClick={showModal}>Tutorial</button>

                <label id="switch-container" style={{ display: isTouchscreen ? "flex" : "none" }}>
                    <span>Placing: {isLeftClickRevealing ? "Reveal" : "Flag 🚩"} </span>
                    <Switch
                        onChange={switchPlacementType}
                        checked={isLeftClickRevealing}
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </label>
            </div>
        </>
    )
}