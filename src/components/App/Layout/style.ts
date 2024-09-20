import styled from 'styled-components';
import { Layout } from 'antd';
const { Header } = Layout;

export const StyledHrader = styled(Header)`
  padding-left: 2rem;
  padding-right: 6rem;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
