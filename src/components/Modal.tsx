import React, { useEffect, useState } from "react"

interface Props {
    isVisible: boolean
    hide: () => void
}

export const Modal = ({ isVisible, hide }: Props) => {
    // Keeps track of which modal slide user is currently on
    const [currentModal, setModal] = useState(0);

    // When user reopens modal, reset slide back to the first one
    useEffect(() =>
        setModal(0)
        , [isVisible])

    const modals = [
        <div className="modal">
            <h1 className="modal-heading">Minesweeper</h1>
            <p className="modal-subheading">This tutorial will explain what this app is and walk you through the features</p>
            <p className="modal-text">
                You can jump in immediately by pressing "skip tutorial", or click "next" to access the next portion of the tutorial
            </p>

            <img src="assets/screenshot.png" className="modal-image"></img>
            <button className="finish-tutorial" onClick={hide}>Close Tutorial</button>
            <button className="next-page" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">Controls</h1>
            <p className="modal-subheading"><strong>Revealing a tile:</strong></p>
            <p className="modal-text">PC: left click the tile with your mouse</p>
            <p className="modal-text">Mobile: Tap the tile on the screen when "Placing: Reveal" is selected</p>

            <p className="modal-subheading"><strong>Placing/Unplacing a flag:</strong></p>
            <p className="modal-text">PC: right click the tile with your mouse</p>
            <p className="modal-text">Mobile: Tap the tile on the screen when "Placing: Flag 🚩" is selected</p>

            <button className="finish-tutorial" onClick={hide}>Close Tutorial</button>
            <button className="prev-page" onClick={prevPage}>Prev</button>
            <button className="next-page" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">Automatic Saving</h1>
            <p className="modal-subheading">
                This app automatically saves your game whenever you make a move, so you can exit and come back later and your
                game will still be intact
            </p>

            <p className="modal-subheading">
                Note that changing the bomb probability will reset the game and delete the saves, as we need to generate a new grid
            </p>

            <button className="finish-tutorial" onClick={hide}>Close Tutorial</button>
            <button className="prev-page" onClick={prevPage}>Prev</button>
            <button className="next-page" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">Resizing Grid</h1>
            <p className="modal-subheading">
                The dimensions of the grid automatically fit to whatever kind of screen you're using, however if you've started a game
                and you resize the window it won't resize the grid as it would need to reset the game
            </p>

            <p className="modal-subheading">
                You can manually resize the grid by clicking the "Resize Grid" button in the menu
            </p>

            <button className="finish-tutorial" onClick={hide}>Close Tutorial</button>
            <button className="prev-page" onClick={prevPage}>Prev</button>
            <button className="next-page" onClick={nextPage}>Next</button>
        </div>,

        <div className="modal">
            <h1 className="modal-heading">That's all folks!</h1>
            <p className="modal-subheading">
                If you enjoyed you can check out the code on <a href="https://github.com/MarkLee7916/Minesweeper-React">GitHub</a>
            </p>

            <img src="assets/code.png" className="modal-image"></img>
            <button className="finish-tutorial" onClick={hide}>Close Tutorial</button>
            <button className="prev-page" onClick={prevPage}>Prev</button>
            <button id="finish-final-modal" onClick={hide}>Finish</button>
        </div>
    ]

    function nextPage() {
        setModal(currentModal => currentModal + 1);
    }

    function prevPage() {
        setModal(currentModal => currentModal - 1);
    }

    return (
        <div id="modal-container" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            {modals[currentModal]}
        </div>
    )
}