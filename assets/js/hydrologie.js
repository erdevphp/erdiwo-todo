class Pluviometrie {

    counter = 0
    lastTr = 'lastTr'
    /**
     * @return <HTMLInputElements>
    */
    addInput(numberOfLine, numberOfColumn) {
        // On crée l'élement input de type 'text' qui va etre ajouté dans le td
        const $inputs = document.createElement('input')
        $inputs.setAttribute('type', 'text')
        $inputs.setAttribute('value', '')
        // On associe l'input récemment crée à une classe afin de faire des calculs
        $inputs.classList.add('small', 'w-100', `line${numberOfLine + 1}`, `column${numberOfColumn + 1}`)
        return $inputs;
    }

    /**
     * Cette méthode permet de créer 12 balises 'input' encapsulées chacunes dans une balise 'td' qu'on insère dans un 'tr' après
     * Elle prend en paramètre l'élément parent pour afficher les inputs et mets à jour le counter à la fin
     * @return <HTMLElement>
     * @param HTMLElement
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

}

window.onload = () => {
    const $dataPluvio = document.querySelector('#dataPluviometric')
    const addButton = document.querySelector('#addInputPluviometric')
    const removeButton = document.querySelector('#removeInputPluviometric')
    const pluvio = new Pluviometrie()
    pluvio.get12Inputs($dataPluvio)

    addButton.addEventListener('click', () => pluvio.get12Inputs($dataPluvio))
    removeButton.addEventListener('click', () => pluvio.removeInput())
}