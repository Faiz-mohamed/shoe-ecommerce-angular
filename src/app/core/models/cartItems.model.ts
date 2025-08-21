import { Product } from "./product.model";

export interface cartItems {
    product :Product,
    quantity :number | undefined
}