import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Check, ChevronDown, Search } from 'lucide-react';

// Comprehensive country data with flags, names, and calling codes
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', dialCode: '+501' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211' },
  { code: 'CD', name: 'Democratic Republic of Congo', flag: '🇨🇩', dialCode: '+243' },
  { code: 'CG', name: 'Republic of Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '+225' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹', dialCode: '+239' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹', dialCode: '+262' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪', dialCode: '+262' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', dialCode: '+677' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', dialCode: '+678' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', dialCode: '+687' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫', dialCode: '+689' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', dialCode: '+685' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸', dialCode: '+1' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', dialCode: '+676' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', dialCode: '+688' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', dialCode: '+686' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', dialCode: '+674' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', dialCode: '+692' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', dialCode: '+691' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', dialCode: '+680' },
];

// Phone number formatting patterns
const phoneFormats: Record<string, { pattern: RegExp; format: string; placeholder: string }> = {
  '+1': {
    pattern: /^(\d{0,3})(\d{0,3})(\d{0,4})$/,
    format: '($1) $2-$3',
    placeholder: '(123) 456-7890'
  },
  '+44': {
    pattern: /^(\d{0,5})(\d{0,6})$/,
    format: '$1 $2',
    placeholder: '07123 456789'
  },
  '+33': {
    pattern: /^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/,
    format: '$1 $2 $3 $4 $5',
    placeholder: '01 23 45 67 89'
  },
  '+49': {
    pattern: /^(\d{0,4})(\d{0,7})$/,
    format: '$1 $2',
    placeholder: '0123 4567890'
  },
  '+81': {
    pattern: /^(\d{0,3})(\d{0,4})(\d{0,4})$/,
    format: '$1-$2-$3',
    placeholder: '090-1234-5678'
  },
  '+86': {
    pattern: /^(\d{0,3})(\d{0,4})(\d{0,4})$/,
    format: '$1 $2 $3',
    placeholder: '138 0013 8000'
  },
  '+65': {
    pattern: /^(\d{0,4})(\d{0,4})$/,
    format: '$1 $2',
    placeholder: '9123 4567'
  },
  '+852': {
    pattern: /^(\d{0,4})(\d{0,4})$/,
    format: '$1 $2',
    placeholder: '9123 4567'
  },
  '+886': {
    pattern: /^(\d{0,3})(\d{0,3})(\d{0,3})$/,
    format: '$1 $2 $3',
    placeholder: '912 345 678'
  },
  '+61': {
    pattern: /^(\d{0,3})(\d{0,3})(\d{0,3})$/,
    format: '$1 $2 $3',
    placeholder: '412 345 678'
  },
};

// Default format for countries not in the specific formats list
const defaultFormat = {
  pattern: /^(\d{0,15})$/,
  format: '$1',
  placeholder: 'Phone number'
};

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}

export function PhoneNumberInput({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  className = ''
}: PhoneNumberInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to US
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect country from browser locale or default to US
  useEffect(() => {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();
    
    if (countryCode) {
      const detectedCountry = countries.find(c => c.code === countryCode);
      if (detectedCountry) {
        setSelectedCountry(detectedCountry);
      }
    }
  }, []);

  // Parse initial value
  useEffect(() => {
    if (value && !isEditing) {
      // Try to parse the full phone number
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.dialCode.length).trim());
      } else {
        // If no country code found, assume it's just the number part
        setPhoneNumber(value);
      }
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Format phone number based on country
  const formatPhoneNumber = (number: string, countryDialCode: string): string => {
    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    
    const format = phoneFormats[countryDialCode] || defaultFormat;
    const match = digits.match(format.pattern);
    
    if (match) {
      return format.format.replace(/\$(\d)/g, (_, group) => match[parseInt(group)] || '');
    }
    
    return digits;
  };

  // Get placeholder for current country
  const getPlaceholder = (): string => {
    const format = phoneFormats[selectedCountry.dialCode];
    return format ? format.placeholder : defaultFormat.placeholder;
  };

  // Validate E.164 format
  const validatePhoneNumber = (number: string): boolean => {
    const digits = number.replace(/\D/g, '');
    const totalLength = selectedCountry.dialCode.replace(/\D/g, '').length + digits.length;
    
    // E.164 standard: maximum 15 digits total
    return totalLength <= 15 && digits.length >= 4; // Minimum 4 digits for the number part
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only digits, spaces, hyphens, and parentheses for formatting
    const sanitized = input.replace(/[^\d\s\-\(\)]/g, '');
    
    const formatted = formatPhoneNumber(sanitized, selectedCountry.dialCode);
    setPhoneNumber(formatted);
    
    // Validate the number
    const isValid = validatePhoneNumber(sanitized);
    setIsValidNumber(isValid);
    
    // Update the full value
    const fullNumber = `${selectedCountry.dialCode} ${formatted}`.trim();
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    
    // Reformat the current number for the new country
    if (phoneNumber) {
      const formatted = formatPhoneNumber(phoneNumber, country.dialCode);
      setPhoneNumber(formatted);
      
      const fullNumber = `${country.dialCode} ${formatted}`.trim();
      onChange(fullNumber);
    }
  };

  if (!isEditing) {
    // Display mode
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Input
          value={value || 'No phone number'}
          className="flex-1 bg-input-background border-border min-h-[40px]"
          readOnly
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartEdit}
          className="min-h-[40px] px-3 shrink-0"
          aria-label="Edit phone number"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </Button>
      </div>
    );
  }

  // Editing mode
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-stretch gap-2">
        {/* Country Code Dropdown - 30% width */}
        <div className="w-[30%] min-w-0">
          <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isDropdownOpen}
                className="w-full h-[40px] justify-between bg-input-background border-primary focus:border-primary ring-2 ring-primary/20 px-3"
              >
                <div className="flex items-center space-x-1 min-w-0 overflow-hidden">
                  <span className="text-base shrink-0">{selectedCountry.flag}</span>
                  <span className="text-sm truncate">{selectedCountry.dialCode}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card border-border max-h-60">
              <Command>
                <div className="flex items-center border-b border-border px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder="Search countries..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="flex-1 bg-transparent border-0 outline-none"
                  />
                </div>
                <CommandList className="max-h-48 overflow-y-auto">
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCountries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.dialCode}`}
                        onSelect={() => handleCountrySelect(country)}
                        className="flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-accent"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-card-foreground">{country.name}</span>
                            <span className="text-muted-foreground text-sm">{country.dialCode}</span>
                          </div>
                        </div>
                        <Check
                          className={`ml-auto h-4 w-4 ${
                            selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Phone Number Input - 70% width */}
        <div className="w-[70%] min-w-0 flex items-stretch gap-2">
          <Input
            ref={inputRef}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={getPlaceholder()}
            className={`flex-1 bg-input-background transition-colors h-[40px] ${
              isValidNumber 
                ? 'border-primary focus:border-primary ring-2 ring-primary/20' 
                : 'border-destructive focus:border-destructive ring-2 ring-destructive/20'
            }`}
          />

          {/* Save/Cancel Buttons */}
          <div className="flex items-stretch gap-1 shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSave}
              disabled={!isValidNumber}
              className="h-[40px] px-3 shrink-0"
              aria-label="Save phone number"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-[40px] px-3 shrink-0"
              aria-label="Cancel editing phone number"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {!isValidNumber && phoneNumber && (
        <p className="text-destructive text-sm flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <span>⚠️ Invalid phone number format</span>
        </p>
      )}
    </div>
  );
}