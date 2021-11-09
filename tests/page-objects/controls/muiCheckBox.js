class MuiCheckBox {
  constructor(element) {
    this.checkbox = cy.get(element);
    this.control = this.checkbox.parent().parent();
  }

  check() {
    this.control.click();
  }
}

export default MuiCheckBox;
