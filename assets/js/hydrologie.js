class Pluviometrie {

    /**
     * Initialisation d'un compteur pour savoir le nombre de ligne des champs ajoutés par l'internaute
     * @type {Integer}
     */
    counter = 0
    /**
     * Le 'id' du dernier élément 'tr' ajoutés par l'internaute
     * @type {String}
     */
    lastTr = 'lastTr'
    /**
     * Les données valides renseignées par l'internaute dans touts les champs
     * @type {Array}
     */
    validData = []
    /**
     * Renvoie la Pluviometrie mensuelle
     * @type {Array}
     */
    pluviometrieMensuelle = []

    /**
     * Crée une balise 'input' de type 'text' avec des classes spécifiques pour faciliter les calculs
     * @return {HTMLInputElement}
    */
    addInput(numberOfLine, numberOfColumn) {
        // On crée l'élement input de type 'text' qui va etre ajouté dans le td
        const $inputs = document.createElement('input')
        $inputs.setAttribute('type', 'text')
        const value = Math.random() * 400;
        $inputs.setAttribute('value', value.toFixed(2)) // On rajoute cet attribut juste pour le developpement
        // On associe l'input récemment crée à une classe afin de faire des calculs
        $inputs.classList.add('data', 'small', 'w-100', `line${numberOfLine + 1}`, `column${numberOfColumn + 1}`)
        return $inputs;
    }

    /**
     * Cette méthode permet de créer 12 balises 'input' encapsulées chacunes dans une balise 'td' qu'on insère dans un 'tr' après
     * Elle prend en paramètre l'élément parent pour afficher les inputs et mets à jour le counter à la fin
     * @return {void}
     * @param {HTMLElement}
     */
    get12Inputs(parentElement) {
        const $tr = document.createElement('tr')
        $tr.setAttribute('id', this.lastTr) // On attribue un 'id' pour chaque nouveau 'tr'
        if (this.counter !== 0) {
            document.querySelector(`#${this.lastTr}`).removeAttribute('id') // On supprime les anciens 'id' du 'tr' précédent
        }
        for (let i = 11; i >= 0; i--) {
            const $input = this.addInput(this.counter, i); // On fait appel à la méthode addInput pour créer les éléments 'inputs'
            const $td = document.createElement('td')
            $td.insertBefore($input, $td.firstChild)
            $tr.insertBefore($td, $tr.firstChild)
            parentElement.insertBefore($tr, parentElement.firstChild)
        }
        this.counter++
    }

    /**
     * Cette méthode permet de supprimer les 12 derniers 'input' d'un 'tr' à partir de son idendifiant lastTr
     */
    removeInput() {
        if (this.counter > 1) {
            const $lastTr = document.querySelector(`#${this.lastTr}`)
            $lastTr.nextElementSibling.setAttribute('id', this.lastTr)
            $lastTr.remove()
            this.counter--
        } else {
            alert('Vous ne pouvez pas supprimer les douzes entrées par défaut.')
        }
    }

    /**
     * Cette méthode retourne le message d'érreur pour l'utilisateur
     * @return <HTMLElement>
     */
    displayCalculError() {
        return `
            <h3 class="text-center">Oppssss, ERREUR DE DONNEE</h3>
            <hr>
            <p>
                Vérifier votre donnée pluviométrique en suivant les instructions suivantes : 
                <div class="d-flex justify-content-center">
                    <ul class="text-left">
                        <li>Un champ vide;</li>
                        <li>Un champ contenant du texte.</li>
                    </ul>
                </div>
            </p>
        `
    }

    /**
     * Permet faire une opération sur les lignes des inputs
     * @param {Integer} indexLine 
     * @param {String} operator 
     * @return Float|String
     */
    operationOnLine(indexLine, operator) {
        return this.operation(indexLine, operator, 'line')
    }

    /**
     * Permet d'effectuer des opérations sur les colonnes des inputs
     * @param {Integer} indexColumn 
     * @param {String} operator 
     * @return Float|String 
     */
    operationOnColumn(indexColumn, operator) {
        return this.operation(indexColumn, operator, 'column')
    }

    /**
     * La méthode générique qui permet de faire des opérations sur les inputs, que ce soit sur les lignes ou les colonnes
     * @param {Integer} index 
     * @param {String} operator 
     * @param {String} type 
     * @returns 
     */
    operation(index, operator, type) {
        let $inputs = document.querySelectorAll(`.${type}${index}`)
        if ($inputs != undefined) {
            let data = new Array()
            $inputs.forEach(function (input) {
                let element = input.value;
                if (element === "" || isNaN(parseFloat(element))) return
                // En cas de validation, on push les données sur le tableau
                data.push(parseFloat(input.value));
            })
            if ( (data.length === 12 && type === 'line') || (data.length === this.counter && type === 'column') ) {
                // On calcule la somme des données (cas d'un mois)
                return data.reduce((a, b) => {
                    return eval(a + operator + b);
                });
            }
            return this.displayCalculError()
        }
    }

    /**
     * Cette fonction s'occupe de la copie coller dynamique en cas d'une copie à partir d'un fichier Excel
     * @param {Event} event 
     */
    managePastedValue(event) {
        let clip = event.clipboardData || window.Clipboard
        let pastedText = clip.getData('text')
        let values = pastedText.split('\t') // On récupère les données copiées à partir d'un fichier Excel
        let fields = []
        for (let i = 1; i <= 12; i++) {
            fields.push(document.querySelector(`.line1.column${i}`))
        }
        for (let j = 0; j < fields.length; j++) {
            fields[j].value = values[j] ? values[j] : ''
        }
    }

    /**
     * Cette méthode détermine si tout les inputs on bien des valeurs
     * @param {HTMLElement} $inputs 
     * @return <Boolean>
     */
    isValidData($inputs) {
        let data = new Array()
        $inputs.forEach(($input) => {
            const value = $input.value
            if (value === "" || isNaN(parseFloat(value))) return
            // En cas de validation, on push les données sur le tableau
            data.push(parseFloat($input.value));
        })
        if (data.length === this.counter * 12) {
            this.validData = data
            return true
        }
        return false
    }

    /**
     * 
     * @param {Event} event 
     */
    manageSubmit(event) {
        event.preventDefault()
        const $inputs = document.querySelectorAll('.data')
        const dataValid = this.isValidData($inputs)
        const $error = document.querySelector('#error')
        const $result = document.querySelector('#result')
        if (dataValid) {
            $error.classList.add('d-none')
            $error.innerHTML = ''
            $result.classList.remove('d-none')
            $result.innerHTML = ''
            $result.innerHTML += this.displayPluviometrieMensuelle()
            $result.innerHTML += this.displayPluviometrieInterannuelle()
            this.displayPluviometrieMensuelleWithChartJs();
        } else {
            $result.classList.add('d-none')
            $error.innerHTML = this.displayCalculError()
            $error.classList.remove('d-none')
        }
    }

    /**
     * Retourne une chaine de caractère qui renvoie les 12valeurs de la pluviométrie mensuelle dans une balise 'td'
     * @return {String}
     */
    getValuePluviometrieMensuelle() {
        let value = ''
        if (this.counter >= 2) {
            let calculPluvioMensuelle
            for (let i = 1; i <= 12; i++) {
                calculPluvioMensuelle = this.operationOnColumn(i, '+') / this.counter;
                this.pluviometrieMensuelle.push(calculPluvioMensuelle)
                value += `<td>${calculPluvioMensuelle.toFixed(2)}</td>`
            }
            return value
        }
        for (let i = 0; i < this.validData.length; i++) {
            const $td = `<td>${this.validData[i]}</td>`
            value += $td
        }
        return value
    }

    /**
     * Cette méthode doit être IMPERATIVEMENT appelée après la méthode getValuePluviometrieMensuelle pour fonctionner
     */
    displayPluviometrieMensuelleWithChartJs() {
        const $canvas = document.createElement('canvas')
        const labels = ['Jan', 'Fev', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
        const data = {
            labels: labels,
            datasets: [{
                label: 'Pluviométrie mensuelle',
                data: this.pluviometrieMensuelle
            }]
        }
        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
        const tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = this.displayPluviometrieMensuelle()
        const divPluvio = tmpDiv.querySelector('#canvasPluviometrieMensuelle')
        divPluvio.appendChild($canvas)
        console.log(divPluvio);
        const myChart = new Chart($canvas, config)
        
    }

    /**
     * Cette fonction retourne l'affichage du résultat de la pluviométrie mensuelle en chaine de caractère
     * @return string
     */
    displayPluviometrieMensuelle() {
        return `
            <h3 class="h4">1. Calcul de la pluviométrie moyenne mensuelle</h3>
            <p>
                A partir du tableau 1 ci-dessus en usant de la formule ci-après, on peut calculer la pluviométrie moyenne mensuelle :
                <div class="text-center">
                    <img src="../assets/img/formule/PMmenuelle.png" alt="Pluviométrie moyenne mensuelle" width="100">
                </div>
                <div class="small">
                    <ul>
                        <li><img src="../assets/img/symbole/PMBar.png" alt="𝑃𝑚" height="20" width="20"> est la pluviométrie moyenne mensuelle en [mm] ;</li>
                        <li>𝑃𝑚𝑖 est la pluviométrie mensuelle du mois concerné en mm, ou 𝑖 représente les
                            années d’observation ;</li>
                        <li>𝑁 est le nombre d’année d’observation</li>
                    </ul>
                </div>
            </p>
            <p>
                <div class="">
                    On obtient la <strong>pluviométrie moyenne mensuelle</strong> representé par le tableau suivant :
                </div>
                <table class="table table-info">
                    <caption class="text-center text-info" align="top">Tableau 2 : Pluviométrie moyenne mensuelle en [mm]</caption>
                    <thead class="text-primary">
                        <tr class="text-center">
                            <th>Jan</th>
                            <th>Feb</th>
                            <th>Mars</th>
                            <th>April</th>
                            <th>May</th>
                            <th>June</th>
                            <th>July</th>
                            <th>Aug</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dec</th>
                        </tr>
                    </thead>
                    <tbody id="result">
                        <tr class="text-center">
                            ${this.getValuePluviometrieMensuelle()}
                        </tr>
                    </tbody>
                </table>
                <div class="my-2">La pluviométrie moyenne mensuelle est illustré par la figure ci-dessous : </div>
                <div class="text-center" id="canvasPluviometrieMensuelle">
                </div>
            </p>
        `
    }

    /**
     * Cette fonction retourne l'affichage du résultat de la pluviométrie interannuelle en chaine de caractère
     * @return string
     */
    displayPluviometrieInterannuelle() {
        return `
            <h3 class="h4">2. Calcul de la pluviométrie interannuelle</h3>
            <p>
                La pluviométrie moyenne interannuelle est la moyenne arithmétique des pluies annuelles de N années d’observation 
                et est donnée par la formule suivante :
                <div class="text-center">
                    <img src="../assets/img/formule/PMinterannuelle.png" alt="Pluviométrie moyenne interannuelle" width="100">
                </div>
                <div class="small d-flex justify-content-center">
                    <ul class="text-left">
                        <li><img src="../assets/img/symbole/PBar.png" alt="𝑃" height="20"> est la pluviométrie moyenne interannuelle en [mm] ;</li>
                        <li>𝑃𝑎 est la pluviométrie annuelle de l’année ou 𝑎 représente l’année en question ;</li>
                        <li>𝑁 est le nombre d’année d’observation.</li>
                    </ul>
                </div>
                <div id="pmInterannuelle">
                    Ainsi, après application numérique, on obtient une pluviométrie moyenne interannuelle <img src="../assets/img/symbole/PBar.png" alt="𝑃" height="20"> = 
                </div>
            </p>
        `
    }

    /**
     * Cette fonction retourne l'affichage du résultat de la répartition moyenne de hauteur de la pluie en chaine de caractère
     * @return string
     */
    displayRepartitionMoyenneHauteurPluie() {
        return `
            <h3 class="h5">3. Calcul de la répartition moyenne mensuelle des hauteurs des pluies Pm%</h3>
            <p>
                La répartition moyenne mensuelle des hauteurs des pluies est donnée par le quotient de la pluviométrie moyenne mensuelle
                sur la pluviométrie moyenne interannuelle multiplié par cent. 
                <div class="">
                    On appliquant la formule Pm% = (<img src="img/symbole/PMBar.png" alt="𝑃𝑚" height="20" width="20"> /  <img src="img/symbole/PBar.png" alt="𝑃" height="20">) * 100, 
                    on obtient la graphique suivante :  
                </div>
                
            </p>
        `
    }
}

window.onload = () => {
    const $form = document.querySelector('#calculPluviometric')
    const $dataPluvio = document.querySelector('#dataPluviometric')
    const addButton = document.querySelector('#addInputPluviometric')
    const removeButton = document.querySelector('#removeInputPluviometric')
    const pluvio = new Pluviometrie()

    // Ajouts des 12 données par défaut
    pluvio.get12Inputs($dataPluvio)

    addButton.addEventListener('click', () => pluvio.get12Inputs($dataPluvio))
    removeButton.addEventListener('click', () => pluvio.removeInput())
    document.addEventListener('paste', (event) => pluvio.managePastedValue(event))
    $form.addEventListener('submit', (event) => pluvio.manageSubmit(event))
}