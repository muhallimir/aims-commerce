import { useGetAllOrdersMutation } from "@store/order.slice"
import { useSelector } from "react-redux";

const useOrderManagement = () => {
    const [reqAllOrders] = useGetAllOrdersMutation();
    const { allOrders: { orders } } = useSelector(({ order }) => order)

    return [reqAllOrders, orders]
}

export default useOrderManagement