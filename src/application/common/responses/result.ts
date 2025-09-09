export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    public details?: any;
    private _value?: T;

    private constructor(isSuccess: boolean, value?: T, error?: string, details?: any) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this.error = error;
        this.details = details;
        Object.freeze(this);
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Cannot get the value of a failed result.");
        }
        return this._value as T;
    }

    public static success<U>(value?: U): Result<U> {
        return new Result<U>(true, value);
    }

    public static failure<U>(error: string, details?: any): Result<U> {
        return new Result<U>(false, undefined, error, details);
    }

    /**
     * Ejecuta una función según si es éxito o fallo.
     */
    public match<U>(
        onSuccess: (value: T) => U,
        onFailure: (error: string, details?: any) => U
    ): U {
        return this.isSuccess
            ? onSuccess(this.getValue())
            : onFailure(this.error ?? 'Unknown error', this.details);
    }

}