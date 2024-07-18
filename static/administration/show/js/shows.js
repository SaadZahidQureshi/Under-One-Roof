function selectFilter(input, filterType) {
    const row = input.closest('tr');
    const filterText = row.querySelector('.selected-filter-text');
    filterText.innerText = filterType;

    console.log(filterText.innerText)

    const dropdownButton = filterText.closest("button");
    const svg = dropdownButton.querySelector("svg");

    if (filterType === 'Inactive') {
        filterText.classList.add("inactive");
        dropdownButton.classList.add("inactive");
        svg.classList.add("inactive");
    } else {
        filterText.classList.remove("inactive");
        dropdownButton.classList.remove("inactive");
        svg.classList.remove("inactive");
    }
}