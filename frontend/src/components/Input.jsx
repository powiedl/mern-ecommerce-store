const Input = ({
  label,
  type = 'text',
  Icon = null,
  placeholder = 'placeholder',
  value,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
        {label}
      </label>
      <div className='mt-1 relative rounded-md shadow-sm'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          {Icon}
        </div>
        <input
          type={type}
          id='name'
          required
          value={value}
          onChange={onChange}
          className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
export default Input;
