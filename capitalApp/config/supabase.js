/**
 * Supabase Configuration
 * 
 * TODO: Instalar Supabase client
 * npm install @supabase/supabase-js
 * 
 * TODO: Crear archivo .env en la raíz del proyecto con:
 * SUPABASE_URL=tu_url_de_supabase
 * SUPABASE_ANON_KEY=tu_anon_key_de_supabase
 */

// import { createClient } from '@supabase/supabase-js';
// import Constants from 'expo-constants';

// Obtener variables de entorno
// const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
// const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// Crear cliente de Supabase
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage, // Para React Native
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

/**
 * INSTRUCCIONES PARA CONFIGURAR SUPABASE:
 * 
 * 1. Crear un proyecto en https://supabase.com
 * 
 * 2. Obtener las credenciales:
 *    - URL del proyecto
 *    - Anon/Public key
 * 
 * 3. Instalar dependencias:
 *    npm install @supabase/supabase-js @react-native-async-storage/async-storage
 * 
 * 4. Crear archivo app.config.js en la raíz con:
 *    export default {
 *      expo: {
 *        ...require('./app.json').expo,
 *        extra: {
 *          supabaseUrl: process.env.SUPABASE_URL,
 *          supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
 *        },
 *      },
 *    };
 * 
 * 5. Crear archivo .env en la raíz:
 *    SUPABASE_URL=https://tu-proyecto.supabase.co
 *    SUPABASE_ANON_KEY=tu_anon_key_aqui
 * 
 * 6. Instalar dotenv para cargar variables:
 *    npm install dotenv
 * 
 * 7. En tu código, importar:
 *    import 'dotenv/config';
 * 
 * 8. ESQUEMA DE LA BASE DE DATOS (ejecutar en SQL Editor de Supabase):
 * 
 * -- Tabla de usuarios (extiende auth.users)
 * CREATE TABLE public.users (
 *   id UUID REFERENCES auth.users(id) PRIMARY KEY,
 *   email TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   surnames TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   date_of_birth DATE NOT NULL,
 *   address TEXT NOT NULL,
 *   id_photo_url TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Habilitar Row Level Security
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * 
 * -- Política: Los usuarios solo pueden ver y editar su propia información
 * CREATE POLICY "Users can view own data"
 *   ON public.users
 *   FOR SELECT
 *   USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update own data"
 *   ON public.users
 *   FOR UPDATE
 *   USING (auth.uid() = id);
 * 
 * -- Trigger para actualizar updated_at
 * CREATE OR REPLACE FUNCTION update_updated_at_column()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   NEW.updated_at = NOW();
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * CREATE TRIGGER update_users_updated_at
 *   BEFORE UPDATE ON public.users
 *   FOR EACH ROW
 *   EXECUTE FUNCTION update_updated_at_column();
 * 
 * 9. CONFIGURAR STORAGE PARA FOTOS DE ID:
 * 
 * -- En Supabase Dashboard, ir a Storage
 * -- Crear un nuevo bucket llamado "id-photos"
 * -- Configurar las políticas de acceso:
 * 
 * CREATE POLICY "Users can upload their own ID photos"
 *   ON storage.objects
 *   FOR INSERT
 *   WITH CHECK (bucket_id = 'id-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
 * 
 * CREATE POLICY "Users can view their own ID photos"
 *   ON storage.objects
 *   FOR SELECT
 *   USING (bucket_id = 'id-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
 * 
 * 10. AUTENTICACIÓN POR EMAIL:
 * 
 * -- En Supabase Dashboard > Authentication > Settings
 * -- Habilitar "Email confirmations" si quieres verificación por email
 * -- Configurar "Email templates" para personalizar los correos
 * 
 * 11. GOOGLE AUTH (Opcional):
 * 
 * -- En Supabase Dashboard > Authentication > Providers
 * -- Habilitar Google
 * -- Configurar con tus credenciales de Google Cloud Console
 */

// Exportar objeto vacío por ahora para evitar errores
export const supabase = null;

console.log('⚠️ Supabase not configured yet. Please follow the instructions in config/supabase.js');
