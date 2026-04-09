import { isAbortErrorType } from "../constants/commons";

const checkIfRequestWasAborted = (err) => err.name === isAbortErrorType;

export { checkIfRequestWasAborted };
