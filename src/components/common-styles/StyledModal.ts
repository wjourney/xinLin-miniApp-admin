import styled from 'styled-components';
import { Modal as AntdModal } from 'antd';

export const StyledModal: any = styled(AntdModal)`
  .ant-modal {
    overflow: hidden !important;
  }
  .ant-modal-wrap {
    overflow: hidden !important;
  }
  .ant-modal-body {
    margin: 1rem;
    max-height: 70vh;
    overflow-y: auto;
  }
`;
