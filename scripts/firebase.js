import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
    databaseURL: 'https://winesandspirits-cdd6b-default-rtdb.firebaseio.com/'
}

export const database = getDatabase(initializeApp(appSettings));
