function toOptions<T>(states: Array<T>, value: keyof T, label: keyof T) {
    return states.map((state) => {
        return {
            value: state[value] as any,
            label: state[label] as any,
        };
    });
}

export default toOptions;
