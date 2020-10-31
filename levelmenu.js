function levelMenu() {
    
}
levelMenu.setup = function() {
    this.active = true;
    if(!("selected" in this)) {
        this.selected = 1;
    }
}