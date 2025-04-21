import React from "react";
import { Form, Input, Button } from "@heroui/react";
import { useForm, SubmitHandler } from 'react-hook-form';

// Definisikan tipe untuk data formulir
interface FormData {
  username: string;
  password: string;
}

// Definisikan tipe untuk props
interface AuthFormProps {
  onSubmit: SubmitHandler<FormData>;
  formType?: 'login';
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, formType = 'login' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = React.useState(false);

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data); // Panggil fungsi onSubmit yang diberikan sebagai prop
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className="w-full justify-center items-center"
      validationBehavior="native"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <Input
          isRequired
          label="Username"
          labelPlacement="outside"
          placeholder="Enter your username"
          type="username"
          {...register("username", { required: "username is required" })}
          errorMessage={errors.username?.message}
        />
        <Input
          isRequired
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password", { required: "Password is required" })}
          errorMessage={errors.password?.message}
        />
        <Button
          className="w-full bg-gradient-to-br from-ag-50 to-ag-100 text-foreground-50"
          type="submit"
          isLoading={loading}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};