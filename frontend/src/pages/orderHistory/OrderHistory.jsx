import { useQuery } from '@apollo/client'
import { ORDER_HISTORY } from '../../../graphql/mutations'
import Order from './Order'


const OrderHistory = () => {
  const { data, loading, error} = useQuery(ORDER_HISTORY, {
    fetchPolicy: 'network-only'
  })

  if (loading) {
    return <div>Loading Order History...</div>
  }

  const orders = data?.getOrderHistory || []

  return(
    <Order orders={orders} />
  )
}

export default OrderHistory;