import { MagnifyingGlass } from  'react-loader-spinner'

export default function Loader() {
  return <MagnifyingGlass
  visible={true}
  height="180"
  width="180"
  ariaLabel="MagnifyingGlass-loading"
  wrapperStyle={{}}
  wrapperClass="MagnifyingGlass-wrapper"
  glassColor = '#c0efff'
  color = '#e15b64'
/>;
}
