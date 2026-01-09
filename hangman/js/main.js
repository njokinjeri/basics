import './ui.js'
import './start.js';
import './navigation.js'
import './categories.js';
import { setupModalListeners} from './modals.js'
import { initializeScreen } from "./ui.js";


document.addEventListener('DOMContentLoaded', () => {
    initializeScreen();
    setupModalListeners();
});