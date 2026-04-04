import { useReducer, useEffect } from 'react'

export const STATE_TYPE = {
    DATA: 'DATA',
    LOADING: 'LOADING',
    ERROR: 'ERROR'
}

const updatehandler = (prevState, action) => {
    const { type = '', payload = '' } = action || {};

    switch (type) {
        case STATE_TYPE.DATA: {
            prevState.data = payload
            break;
        }
        case STATE_TYPE.LOADING: {
            prevState.isPending = payload;
            break;

        }
        case STATE_TYPE.ERROR: {
            prevState.error = payload;
            break;

        }
        default: {
            return prevState;
        }
    }
    return prevState;
}

const usePromise = ({
    defaultValue = null,
    executeOnMount = false,
    defaultError = null,
    execute = async () => { }
}) => {
    const [currentState, updateState] = useReducer(updatehandler, {
        data: defaultValue || null,
        isPending: executeOnMount,
        error: defaultError || ''
    });

    const callApi =useCallback

    useEffect(() => {

        if (executeOnMount) {

        }

    }, [executeOnMount]);




    return {
        currentState,
        updateState,
    }


};



export { usePromise, STATE_TYPE }