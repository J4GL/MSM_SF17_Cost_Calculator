class UpgradeTracker {
    constructor() {
        this.upgrades = JSON.parse(localStorage.getItem('upgrades')) || [];
        this.currentSession = JSON.parse(localStorage.getItem('currentSession')) || null;
        this.loadSession();
        this.displayHistory();
    }

    startNewSession(startingMoney) {
        this.currentSession = {
            startingMoney: startingMoney,
            currentMoney: startingMoney,
            upgrades: [],
            startTime: new Date().toISOString()
        };
        this.saveSession();
        this.updateDisplay();
        document.getElementById('sessionCard').style.display = 'block';
    }

    recordUpgrade(newAmount) {
        if (!this.currentSession) return;

        const cost = this.currentSession.currentMoney - newAmount;
        const upgrade = {
            previousAmount: this.currentSession.currentMoney,
            newAmount: newAmount,
            cost: cost,
            timestamp: new Date().toISOString()
        };

        this.currentSession.upgrades.push(upgrade);
        this.currentSession.currentMoney = newAmount;
        
        this.saveSession();
        this.updateDisplay();
    }

    getAverageCost() {
        if (!this.currentSession || this.currentSession.upgrades.length === 0) return 0;
        
        const totalCost = this.currentSession.upgrades.reduce((sum, upgrade) => sum + upgrade.cost, 0);
        return Math.round(totalCost / this.currentSession.upgrades.length);
    }

    resetSession() {
        if (this.currentSession && this.currentSession.upgrades.length > 0) {
            this.upgrades.push({...this.currentSession, endTime: new Date().toISOString()});
            this.saveUpgrades();
        }
        
        this.currentSession = null;
        localStorage.removeItem('currentSession');
        document.getElementById('sessionCard').style.display = 'none';
        document.getElementById('startingMoney').value = '';
        this.displayHistory();
    }

    updateDisplay() {
        if (!this.currentSession) return;

        document.getElementById('initialAmount').textContent = this.currentSession.startingMoney.toLocaleString();
        document.getElementById('currentAmount').textContent = this.currentSession.currentMoney.toLocaleString();
        document.getElementById('upgradeCount').textContent = this.currentSession.upgrades.length;
        document.getElementById('averageCost').textContent = this.getAverageCost().toLocaleString();
        
        this.updateGlobalStats();
    }

    loadSession() {
        if (this.currentSession) {
            document.getElementById('sessionCard').style.display = 'block';
            this.updateDisplay();
        }
    }

    displayHistory() {
        this.updateGlobalStats();
        
        const historyContainer = document.getElementById('upgradeHistory');
        historyContainer.innerHTML = '';

        if (this.upgrades.length === 0) {
            historyContainer.innerHTML = '<p>Aucun historique disponible.</p>';
            return;
        }

        this.upgrades.reverse().forEach((session, index) => {
            const sessionDiv = document.createElement('div');
            sessionDiv.className = 'history-session';
            
            const totalCost = session.upgrades.reduce((sum, upgrade) => sum + upgrade.cost, 0);
            const averageCost = session.upgrades.length > 0 ? Math.round(totalCost / session.upgrades.length) : 0;
            const startDate = new Date(session.startTime).toLocaleDateString('fr-FR');
            
            sessionDiv.innerHTML = `
                <h3>Session du ${startDate}</h3>
                <div class="session-stats">
                    <span>Argent initial: ${session.startingMoney.toLocaleString()}</span>
                    <span>Améliorations: ${session.upgrades.length}</span>
                    <span>Coût moyen: ${averageCost.toLocaleString()}</span>
                    <span>Coût total: ${totalCost.toLocaleString()}</span>
                </div>
                <button onclick="deleteSession(${this.upgrades.length - 1 - index})" class="delete-btn">🗑️</button>
            `;
            
            historyContainer.appendChild(sessionDiv);
        });
        this.upgrades.reverse();
    }
    
    updateGlobalStats() {
        let totalUpgrades = 0;
        let totalCost = 0;
        let allCosts = [];
        
        // Inclure la session courante si elle existe
        if (this.currentSession && this.currentSession.upgrades.length > 0) {
            totalUpgrades += this.currentSession.upgrades.length;
            const sessionCosts = this.currentSession.upgrades.map(upgrade => upgrade.cost);
            totalCost += sessionCosts.reduce((sum, cost) => sum + cost, 0);
            allCosts.push(...sessionCosts);
        }
        
        // Ajouter toutes les sessions terminées
        this.upgrades.forEach(session => {
            totalUpgrades += session.upgrades.length;
            const sessionCosts = session.upgrades.map(upgrade => upgrade.cost);
            totalCost += sessionCosts.reduce((sum, cost) => sum + cost, 0);
            allCosts.push(...sessionCosts);
        });
        
        const globalAverage = totalUpgrades > 0 ? Math.round(totalCost / totalUpgrades) : 0;
        const minCost = allCosts.length > 0 ? Math.min(...allCosts) : null;
        const maxCost = allCosts.length > 0 ? Math.max(...allCosts) : null;
        
        document.getElementById('globalAverage').textContent = globalAverage.toLocaleString();
        document.getElementById('totalUpgrades').textContent = totalUpgrades.toLocaleString();
        document.getElementById('totalCost').textContent = totalCost.toLocaleString();
        document.getElementById('minCost').textContent = minCost ? minCost.toLocaleString() : '-';
        document.getElementById('maxCost').textContent = maxCost ? maxCost.toLocaleString() : '-';
    }

    deleteSession(index) {
        this.upgrades.splice(index, 1);
        this.saveUpgrades();
        this.displayHistory();
    }

    clearHistory() {
        if (confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ?')) {
            this.upgrades = [];
            this.saveUpgrades();
            this.displayHistory();
        }
    }


    importData(importString) {
        try {
            // Tenter d'abord le format JSON
            const data = JSON.parse(importString);
            
            if (data.upgrades) {
                this.upgrades = [...this.upgrades, ...data.upgrades];
                this.saveUpgrades();
            }
            
            this.displayHistory();
            alert('Données JSON importées avec succès !');
            document.getElementById('importData').value = '';
        } catch (error) {
            // Si ce n'est pas du JSON, tenter le format texte personnalisé
            this.importTextNotes(importString);
        }
    }

    importTextNotes(textNotes) {
        try {
            const sessions = this.parseTextNotes(textNotes);
            
            if (sessions.length === 0) {
                alert('Aucune donnée valide trouvée dans le texte');
                return;
            }
            
            this.upgrades = [...this.upgrades, ...sessions];
            this.saveUpgrades();
            this.displayHistory();
            
            alert(`${sessions.length} session(s) importée(s) avec succès !`);
            document.getElementById('importData').value = '';
        } catch (error) {
            alert('Erreur lors de l\'import : format de texte invalide');
        }
    }

    parseTextNotes(textNotes) {
        const lines = textNotes.split('\n').map(line => line.trim()).filter(line => line);
        const sessions = [];
        let currentSession = null;
        let sessionNumber = 1;
        
        for (const line of lines) {
            // Vérifier si c'est une ligne de séparation (tirets)
            if (line.match(/^-+$/)) {
                // Terminer la session courante si elle existe
                if (currentSession && currentSession.upgrades.length > 0) {
                    sessions.push({
                        ...currentSession,
                        endTime: new Date().toISOString()
                    });
                }
                // Préparer pour une nouvelle session
                currentSession = null;
                sessionNumber++;
                continue;
            }
            
            // Extraire le montant de la ligne (enlever espaces et convertir)
            const amount = parseInt(line.replace(/\s/g, ''));
            
            if (isNaN(amount)) continue;
            
            // Si pas de session courante, en créer une nouvelle
            if (!currentSession) {
                currentSession = {
                    startingMoney: amount,
                    currentMoney: amount,
                    upgrades: [],
                    startTime: new Date().toISOString(),
                    source: 'text_import',
                    sessionNumber: sessionNumber
                };
            } else {
                // Ajouter une amélioration
                const cost = currentSession.currentMoney - amount;
                const upgrade = {
                    previousAmount: currentSession.currentMoney,
                    newAmount: amount,
                    cost: cost,
                    timestamp: new Date().toISOString()
                };
                
                currentSession.upgrades.push(upgrade);
                currentSession.currentMoney = amount;
            }
        }
        
        // Ne pas oublier la dernière session
        if (currentSession && currentSession.upgrades.length > 0) {
            sessions.push({
                ...currentSession,
                endTime: new Date().toISOString()
            });
        }
        
        return sessions;
    }

    saveSession() {
        localStorage.setItem('currentSession', JSON.stringify(this.currentSession));
    }

    saveUpgrades() {
        localStorage.setItem('upgrades', JSON.stringify(this.upgrades));
    }
}

const tracker = new UpgradeTracker();

function startNewSession() {
    const startingMoney = parseInt(document.getElementById('startingMoney').value);
    if (isNaN(startingMoney) || startingMoney <= 0) {
        alert('Veuillez entrer un montant valide');
        return;
    }
    tracker.startNewSession(startingMoney);
}

function recordUpgrade() {
    const currentMoney = parseInt(document.getElementById('currentMoney').value);
    if (isNaN(currentMoney) || currentMoney < 0) {
        alert('Veuillez entrer un montant valide');
        return;
    }
    
    tracker.recordUpgrade(currentMoney);
    document.getElementById('currentMoney').value = '';
}

function resetSession() {
    tracker.resetSession();
}

function clearHistory() {
    tracker.clearHistory();
}

function deleteSession(index) {
    tracker.deleteSession(index);
}


function importData() {
    const importString = document.getElementById('importData').value.trim();
    if (!importString) {
        alert('Veuillez coller des données à importer');
        return;
    }
    tracker.importData(importString);
}