import { FixedSizeList as List } from "react-window"

const VirtualizedList = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={35} width={300}>
    {({ index, style }) => <div style={style}>{items[index]}</div>}
  </List>
)

export default VirtualizedList
