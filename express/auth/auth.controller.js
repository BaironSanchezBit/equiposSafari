const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

exports.getUserById = async (req, res, next) => {
    try {
        const users = await User.findOne({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.comparePassword = async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        return res.json({
            success: true,
            message: 'Passwords match'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Middleware de autenticación
exports.authenticateToken = (req, res, next) => {
    // Obtiene el token de acceso de la cookie
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verifica el token de acceso y obtiene su payload (usuario ID)
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.id; // Añade el ID del usuario al objeto req para que esté disponible en las rutas protegidas
        next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

exports.createUser = async (req, res, next) => {
    const newUser = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    };

    try {
        const user = await User.create(newUser);
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

        // Crea una cookie con el token de acceso y lo envía en la respuesta
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: expiresIn * 1000 });
        res.json({
            success: true,
            message: 'User created successfully!',
            data: {
                id: user._id,
                nombre: user.nombre,
                apellido: user.apellido,
                telefono: user.telefono,
                email: user.email,
                accessToken: accessToken,
                expiresIn: expiresIn
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

exports.loginUser = async (req, res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        const user = await User.findOne({ email: userData.email }).exec();
        if (!user) {
            res.status(409).json({
                success: false,
                message: 'Something is wrong'
            });
        } else {
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if (resultPassword) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

                // Crea una cookie con el token de acceso y lo envía en la respuesta
                res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: expiresIn * 1000 });
                res.json({
                    success: true,
                    message: 'Logged in successfully!',
                    data: {
                        id: user._id,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        telefono: user.telefono,
                        email: user.email,
                        accessToken: accessToken,
                        expiresIn: expiresIn
                    }
                });
            } else {
                res.status(409).json({
                    success: false,
                    message: 'Something is wrong'
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.loginUserName = async (req, res, next) => {
    const userData = {
        nombre: req.body.nombre,
        password: req.body.password
    };

    try {
        const user = await User.findOne({ nombre: userData.nombre}).exec();
        if (!user) {
            res.status(409).json({
                success: false,
                message: 'Something is wrong'
            });
        } else { 
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if (resultPassword) {
                const expiresIn = 15 * 60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

                // Crea una cookie con el token de acceso y lo envía en la respuesta
                res.json({
                    success: true,
                    message: 'Logged in successfully!',
                    data: {
                        accessToken: accessToken,
                        expiresIn: expiresIn
                    }
                });
            } else {
                res.status(409).json({
                    success: false,
                    message: 'Something is wrong'
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.logoutUser = (req, res) => {
    // Elimina la cookie que contiene el token de acceso
    res.clearCookie('user');
    res.status(200).json({ success: true, message: 'Logged out successfully!' });
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Verifica si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Actualiza el nombre
        if (nombre) {
            user.nombre = nombre;
        }

        // Guarda los cambios en la base de datos
        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                id: user._id,
                nombre: user.nombre
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

