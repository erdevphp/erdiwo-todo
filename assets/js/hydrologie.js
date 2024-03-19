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