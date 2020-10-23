var view_obj = {
    render: async () => {
        let view = ``;
        return view;
    }
}

$("#appHeader").appHeader();
$("#productListing").productList({ productList: products.items });