const util = {
  success: (status: number, message: string, data?: any) => {
    return {
      status,
      success: true,
      message,
      data,
    };
  },
  fail: (status: number, message: string, data?: any) => {
    return {
      status,
      success: false,
      message,
    };
  },
  buildMap(
    entries: Array<Record<string, any>>,
    { key = 'id', keepKey = true } = {}
  ) {
    return Object.fromEntries(
      entries.map((entry) =>
        keepKey
          ? [entry[key], { ...entry }]
          : [entry[key], { ...entry, [key]: undefined }]
      )
    );
  },
};

export default util;
