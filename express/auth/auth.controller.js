const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id); // Buscar al usuario por su ID
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' }); // Si el usuario no se encuentra, devuelve un error
        }
        res.json(user); // Devuelve la información del usuario
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
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

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        return next();
    } else {
        return res.status(403).json({ success: false, message: 'Access denied: Admins only.' });
    }
};

exports.datosCiudades = async (req, res, next) => {
    try {
        const response = await axios.get('https://api-colombia.com/api/v1/City');

        const departamentosExcluidos = [];

        const datosFiltrados = response.data.filter(ciudad => !departamentosExcluidos.includes(ciudad.departamento));

        res.json(datosFiltrados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.datosDepartamentos = async (req, res, next) => {
    try {
        const response = await axios.get('https://api-colombia.com/api/v1/Department');

        const departamentosExcluidos = [];

        const datosFiltrados = response.data.filter(ciudad => !departamentosExcluidos.includes(ciudad.departamento));

        res.json(datosFiltrados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUserWithProfileImage = async (req, res) => {
    const { email, nombre, telefono, password, cargo, roles } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se ha subido ningún archivo o el formato no es válido.' });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const newUser = { email, nombre, telefono, password: hashedPassword, cargo, role: roles };

    try {
        const user = await User.create(newUser);

        user.image.path = req.file.path;
        user.image.purpose = 'profile';
        await user.save();

        res.json({
            success: true,
            message: 'User created successfully with profile image!',
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        } else {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

exports.getUserImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        let imagePath;

        if (user && user.image && user.image.path && fs.existsSync(path.join(__dirname, '..', user.image.path))) {
            imagePath = path.join(__dirname, '..', user.image.path);
        } else {
            imagePath = path.join(__dirname, '..', 'uploads', 'user.png');
        }

        res.sendFile(imagePath);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.loginUserNameAdmin = async (req, res, next) => {
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
                const expiresIn = 60 * 60 * 24; // 24 horas en segundos
                const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: expiresIn });

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

exports.loginUserName = async (req, res, next) => {
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
                const expiresIn = 60 * 60 * 24;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

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
    res.clearCookie('user');
    res.status(200).json({ success: true, message: 'Logged out successfully!' });
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, nombre, telefono, password, cargo, role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (password && password !== user.password) {
            const hashedPassword = bcrypt.hashSync(password);
            user.password = hashedPassword;
        }


        user.email = email;
        user.nombre = nombre;
        user.telefono = telefono;
        user.cargo = cargo;
        user.role = role.split(',');
        
        if (req.file) {
            if (user.image && user.image.path) {
                fs.unlinkSync(user.image.path);
            }

            user.image = {
                path: req.file.path,
                purpose: 'profile'
            };
        }

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.verifyAdminRole = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.cargo !== 'Gerencia' && user.cargo !== 'Programador') {
            return res.status(403).json({ success: false, message: 'Access denied. Only Admins can access this endpoint.' });
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.image && user.image.path) {
            fs.unlinkSync(user.image.path);
        }

        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};