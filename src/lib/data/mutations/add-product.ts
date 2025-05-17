import { useMutation } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

const addProduct = async (data: any) => {
  const response = await protectedApi.post('/blood-inventory/', data)
  console.log(response)
}

const useAddProduct = () => {
  return useMutation({
    mutationKey: ['inventory'],
    mutationFn: addProduct,
  })
}

export default useAddProduct    

