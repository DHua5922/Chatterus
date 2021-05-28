import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import tw from 'tailwind-styled-components';
import {Close} from "@styled-icons/evaicons-solid/Close";
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import IconMessage from './IconMessage';

const MyModal = tw(Modal)`
    items-center
    flex
    justify-center
`;

const CloseIcon = tw(Close)`
    ${props => props.width || "w-6"}
    cursor-pointer
`;

const Header = tw.h1`
    flex
    justify-between
    text-2xl
`;

const Body = tw.div`
    py-4
`;

const Footer = tw.div`
    mb-3
`;

export default function Prompt({ modal }) {
    return (
        <MyModal
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            {...modal.props}
        >
            <Fade in={modal.props.open}>
                <div className={"bg-white outline-none rounded-md p-8 w-1/4"}>
                    <Header>
                        {modal.header.children}
                        <CloseIcon onClick={modal.props.onClose} />
                    </Header>
                    <Body>{modal.body.children}</Body>
                    <Footer {...modal.footer.props}>
                        {modal.footer.children}
                    </Footer>
                    <div>
                        {
                            modal.message.pending.isPending &&
                                <IconMessage message={modal.message.pending.message} />
                        }
                        {
                            modal.message.error &&
                                <ErrorMessage message={modal.message.error} />
                        }
                        {
                            modal.message.success &&
                                <SuccessMessage message={modal.message.success} />
                        }
                    </div>
                </div>
            </Fade>
        </MyModal>
  );
}