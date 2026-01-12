import { setupModalListeners } from "./modal.js"
import { initializeScreen } from "./ui.js"
import './start.js'
import './navigation.js'


document.addEventListener('DOMContentLoaded', () => {
    initializeScreen();
    setupModalListeners();
})