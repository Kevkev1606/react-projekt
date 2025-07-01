const Rental = require('../../models/carrental/rental');
const Category = require('../../models/carrental/category');
const Rented = require('../../models/carrental/rented');


const verifyToken = require('../session/verifyToken');


module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/carrental/cars':
     *      get:
     *          tags: 
     *              - Get Methods Car Rental
     *          summary: Get all cars
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/carrental/cars', async function (req,res){
        try{
            let cars = await Rental.find({active:true},{"rented":0});
            res.status(200).send(cars);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });


    /**
     * @openapi
     * '/carrental/car/:rentalId':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get a specific car
     *     parameters:
     *      - name: rentalId
     *        in: path
     *        description: The ID of the car
     *        required: true
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/car/:rentalId', async function (req,res){
        try{
            let rental = await Rental.findById(req.params.rentalId,{"rented":0});
            res.status(200).send(rental);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


    /**
     * @openapi
     * '/carrental/cartypes/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get all car types
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/cartypes/', async function (req,res){
        try{     
            let categories = await Category.find();
            res.status(200).send(categories);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
     //Selber angepasst
    /**
     * @openapi
     * '/carrental/search':
     *   get:
     *     tags:
     *       - Get Methods Car Rental
     *     summary: Search for cars
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: tags
     *         in: query
     *         description: Search tags
     *         required: false
     *         schema:
     *           type: string
     *       - name: startDate
     *         in: query
     *         description: Start date of rental in format "dd.mm.yyyy"
     *         required: false
     *         schema:
     *           type: string
     *       - name: endDate
     *         in: query
     *         description: End date of rental in format "dd.mm.yyyy"
     *         required: false
     *         schema:
     *           type: string
     *       - name: category
     *         in: query
     *         description: Car type/category ID
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of available cars
     *       500:
     *         description: Server Error
     */

    app.get('/carrental/search', verifyToken, async function (req, res) {
        try {
            const filters = req.query.tags;
            const startDateStr = req.query.startDate;
            const endDateStr = req.query.endDate;
            const category = req.query.category;

            let rentals = null;
            let searchTags = null;
            let dateInt = null;

            if (filters) {
                searchTags = filters.toLowerCase().split(',');
            }

            // Datum verarbeiten
            if (startDateStr && endDateStr) {
                const parseDate = (str) => {
                    const [day, month, year] = str.split('.');
                    return new Date(`${year}-${month}-${day}`);
                };
                const rentalStart = parseDate(startDateStr);
                const rentalEnd = parseDate(endDateStr);

                dateInt = { start: rentalStart, end: rentalEnd };
            }

            if (filters && !dateInt && !category) {
                rentals = await Rental.find({ tags: { $in: searchTags }, active: true }, { "rented": 0 });
            } else if (!filters && dateInt && !category) {
                rentals = await Rental.find({
                    $or: [
                        {
                            rented: {
                                $not: {
                                    $elemMatch: {
                                        startDate: { $lte: dateInt.end },
                                        endDate: { $gte: dateInt.start }
                                    }
                                }
                            },
                            active: true
                        },
                        { rentedLength: { $lte: 0 }, active: true }
                    ]
                }, { "rented": 0 });
            } else if (!filters && !dateInt && category) {
                rentals = await Rental.find({ cartype: category, active: true });
            } else if (filters && dateInt && !category) {
                rentals = await Rental.find({
                    $and: [
                        {
                            $or: [
                                {
                                    rented: {
                                        $not: {
                                            $elemMatch: {
                                                startDate: { $lte: dateInt.end },
                                                endDate: { $gte: dateInt.start }
                                            }
                                        }
                                    },
                                    active: true
                                },
                                { rentedLength: { $lte: 0 }, active: true }
                            ]
                        },
                        { tags: { $in: searchTags } }
                    ]
                }, { "rented": 0 });
            } else if (filters && !dateInt && category) {
                rentals = await Rental.find({ cartype: category, active: true, tags: { $in: searchTags } });
            } else if (!filters && dateInt && category) {
                rentals = await Rental.find({
                    $and: [
                        {
                            $or: [
                                {
                                    rented: {
                                        $not: {
                                            $elemMatch: {
                                                startDate: { $lte: dateInt.end },
                                                endDate: { $gte: dateInt.start }
                                            }
                                        }
                                    },
                                    active: true
                                },
                                { rentedLength: { $lte: 0 }, active: true }
                            ]
                        },
                        { cartype: category }
                    ]
                }, { "rented": 0 });
            } else if (filters && dateInt && category) {
                rentals = await Rental.find({
                    $and: [
                        {
                            $or: [
                                {
                                    rented: {
                                        $not: {
                                            $elemMatch: {
                                                startDate: { $lte: dateInt.end },
                                                endDate: { $gte: dateInt.start }
                                            }
                                        }
                                    },
                                    active: true
                                },
                                { rentedLength: { $lte: 0 }, active: true }
                            ]
                        },
                        { cartype: category },
                        { tags: { $in: searchTags } }
                    ]
                }, { "rented": 0 });
            }

            res.status(200).send(rentals);
        } catch (error) {
            let errorObj = { body: req.body, errorMessage: "Server error!" };
            res.status(500).send(errorObj);
        }
    });

    /**
     * @openapi
     * '/carrental/rented/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get all rented cars
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/rented/',verifyToken, async function (req,res){
        try{
            let rented = await Rental.find({"rented.userId":req.user.id},{_id:1,'rented.$':1});
            res.status(200).send(rented);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     * '/carrental/lent/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: All cars which where lent
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/lent/',verifyToken, async function (req,res){
        try{     
            let lent = await Rental.find({owner:req.user.id, rentedLength:{$gt:0}});
            res.status(200).send(lent);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


    /**
     * @openapi
     * '/carrental/rental/':
     *  post:
     *     tags: 
     *     - Post Methods Car Rental
     *     summary: Add a new car as a rental
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - cartype
     *              - owner
     *              - price
     *              - brand
     *              - carmodel
     *              - kilometers
     *              - horsepower
     *              - weight
     *              - doors
     *              - active
     *              - description
     *              - href
     *              - rentedLength
     *              - tags
     *            properties:
     *              cartype:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              owner:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              price:
     *                type: Number
     *                default: 123
     *              brand:
     *                type: String
     *                default: "abc"
     *              carmodel: 
     *                type: String
     *                default: "abc"
     *              kilometers:
     *                type: Number
     *                default: 123
     *              horsepower:
     *                type: Number
     *                default: 123
     *              weight:
     *                type: Number
     *                default: 123
     *              doors:
     *                type: Number
     *                default: 123
     *              active:
     *                type: Boolean
     *                default: true
     *              description:
     *                type: String
     *                default: "abc"
     *              href:
     *                type: String
     *                default: "abc"
     *              rentedLength:
     *                type: Number
     *                default: 123
     *              tags:
     *                type: [String]
     *                default: ["abc","abc"]
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/carrental/rental/', verifyToken,function (req,res){
        try{

            let rentalData = req.body

            rentalData.tags = rentalData.tags.map(t => t.toLowerCase().trim()); //Selber hinzugefügt, Tags sollen mithilfe von lowerCase in Kleinbuschtaben abgespeichert werden, damit Tagsuche funktioniert
            rentalData.rentedLength = 0;

            let rental = new Rental(rentalData);
            rental.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                    console.error(err.message);
                }else{
                    res.status(201).send("successfully added!");
                }
            });


        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     

     //Selber hinzugefügt bzw. überarbeitet

    /**
     * @openapi
     * '/carrental/cartype':
     *  post:
     *     tags: 
     *     - Post Methods Car Rental
     *     summary: Add a new car type category
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - cartype
     *            properties:
     *              cartype:
     *                type: string
     *                default: "SUV"
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
    app.post('/carrental/cartype', async function (req, res) {
        try {
            const { cartype } = req.body;
            if (!cartype) {
                return res.status(422).send("Cartype is required!");
            }
            const category = new Category({ cartype });
            await category.save();
            res.status(201).send("successfully added!");
        } catch (error) {
            let errorObj = { body: req.body, errorMessage: "Server error!" };
            res.status(500).send(errorObj);
        }
    });

    /**
     * @openapi
     * '/carrental/rent/':
     *  post:
     *     tags: 
     *     - Post Methods Car Rental
     *     summary: Rent a car
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - rentalId
     *              - userId
     *              - startDate
     *              - endDate
     *              - price
     *            properties:
     *              rentalId:
     *                type: ObjectId
     *                default: ObjectId("665f1a43e80f2a81fc9357b9")
     *              userId:
     *                type: ObjectId
     *                default: ObjectId("665f189ad1c37b519da0eae6")
     *              startDate:
     *                type: string
     *                example: "25.06.2025"
     *              endDate:
     *                type: string
     *                example: "30.06.2025"
     *              price:
     *                type: number
     *                example: 150
     *     responses:
     *      201:
     *        description: Successfully added
     *      422:
     *        description: Missing or invalid data
     *      500:
     *        description: Server Error
     */
    app.post('/carrental/rent/', verifyToken, async function (req, res) {
        try {
            const { rentalId, userId, startDate, endDate, price } = req.body;

            if (!rentalId || !userId || !startDate || !endDate || !price) {
                return res.status(422).send("Missing required fields!");
            }

            const rental = await Rental.findById(rentalId);
            if (!rental) {
                return res.status(404).send("Rental not found");
            }

            // Datum umwandeln von "DD.MM.YYYY"
            const parseDate = (dateStr) => {
                const [day, month, year] = dateStr.split(".");
                return new Date(`${year}-${month}-${day}`);
            };


            const rentData = {
                userId: userId,
                rentalId: rentalId,
                startDate: parseDate(startDate),
                endDate: parseDate(endDate),
                price: price
            };

            rental.rented.push(rentData);
            rental.rentedLength = rental.rented.length;

            await rental.save();

            res.status(201).send("Successfully added!");
        } catch (error) {
            console.error(error);
            res.status(500).send({
                body: req.body,
                errorMessage: "Server error!"
            });
        }
    });


} 