import moment from "moment";

export const tsFromNow = (timestamp: number) => moment.unix(timestamp).fromNow();
