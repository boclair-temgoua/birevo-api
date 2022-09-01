import {
  isNotEmpty,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const MatchIsEmpty = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchIsEmptyConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'MatchIsEmpty' })
export class MatchIsEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: string | number, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return isNotEmpty(value) && isNotEmpty(relatedValue);
  }
  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: (() => any)[] = args.constraints;
    return `${constraintProperty} or ${args.property} is empty`;
  }
}
