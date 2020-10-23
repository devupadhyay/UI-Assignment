$.fn.appHeader = function () {
    let _self = this;

    _self.html(`<div class="row no-gutters">
                    <div class="d-flex align-items-center">
                        <h1>All Items</h1>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <span class="item-add-msg"></span>
                    </div>
                </div>`);

    // return the widget object
    return _self;
}