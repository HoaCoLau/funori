<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Tabs; // Dùng Tabs cho gọn
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Product Details')
                    ->tabs([
                        // --- TAB 1: THÔNG TIN CƠ BẢN ---
                        Tabs\Tab::make('Thông tin chung')
                            ->icon('heroicon-m-information-circle')
                            ->schema([
                                TextInput::make('product_name')
                                    ->required()
                                    ->maxLength(255),
                                
                                TextInput::make('base_sku')
                                    ->label('Mã SKU gốc')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(100),
                                
                                TextInput::make('base_price')
                                    ->label('Giá cơ bản')
                                    ->required()
                                    ->numeric()
                                    ->prefix('$')
                                    ->default(0.00),
                                
                                Select::make('categories')
                                    ->label('Danh mục')
                                    ->relationship('categories', 'category_name') // Quan hệ n-n
                                    ->multiple()
                                    ->preload()
                                    ->searchable(),

                                Select::make('collections')
                                    ->label('Bộ sưu tập')
                                    ->relationship('collections', 'collection_name') // Quan hệ n-n
                                    ->multiple()
                                    ->preload(),

                                Textarea::make('description')
                                    ->label('Mô tả sản phẩm')
                                    ->rows(5)
                                    ->columnSpanFull(),

                                Toggle::make('is_customizable')
                                    ->label('Cho phép tùy chỉnh?'),
                            ]),

                        // --- TAB 2: HÌNH ẢNH (ASYNC UPLOAD) ---
                        Tabs\Tab::make('Hình ảnh')
                            ->icon('heroicon-m-photo')
                            ->schema([
                                Repeater::make('images')
                                    ->relationship()
                                    ->schema([
                                        FileUpload::make('temporary_url')
                                            ->label('File Ảnh')
                                            ->disk('public')
                                            ->directory('temp_images')
                                            ->image()
                                            ->required()
                                            ->columnSpan(2),
                                        
                                        TextInput::make('alt_text')
                                            ->label('Mô tả ảnh (Alt)')
                                            ->columnSpan(1),
                                        
                                        TextInput::make('sort_order')
                                            ->label('Thứ tự')
                                            ->numeric()
                                            ->default(0)
                                            ->columnSpan(1),

                                        Hidden::make('status')->default('temporary'),
                                        Hidden::make('image_url')->default(null),
                                    ])
                                    ->columns(4)
                                    ->defaultItems(0)
                                    ->reorderableWithButtons()
                                    ->collapsible()
                            ]),

                        // --- TAB 3: BIẾN THỂ (VARIANTS) ---
                        Tabs\Tab::make('Biến thể (Variants)')
                            ->icon('heroicon-m-swatch')
                            ->schema([
                                Repeater::make('variants')
                                    ->relationship()
                                    ->schema([
                                        TextInput::make('variant_sku')
                                            ->label('SKU Biến thể')
                                            ->required(),
                                        
                                        TextInput::make('price')
                                            ->label('Giá riêng')
                                            ->numeric()
                                            ->required(),
                                        
                                        TextInput::make('stock_quantity')
                                            ->label('Tồn kho')
                                            ->numeric()
                                            ->default(0),

                                        // Upload ảnh riêng cho biến thể (nếu cần)
                                        // Lưu ý: Logic upload ảnh biến thể có thể cần xử lý riêng nếu muốn async
                                        // Ở đây tạm thời dùng upload trực tiếp hoặc link
                                        FileUpload::make('main_image_url')
                                            ->label('Ảnh đại diện biến thể')
                                            ->disk('public')
                                            ->directory('variant_images')
                                            ->image(),
                                    ])
                                    ->columns(2)
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['variant_sku'] ?? null),
                            ]),

                        // --- TAB 4: THÔNG SỐ KỸ THUẬT ---
                        Tabs\Tab::make('Thông số kỹ thuật')
                            ->icon('heroicon-m-list-bullet')
                            ->schema([
                                Repeater::make('specifications')
                                    ->relationship()
                                    ->schema([
                                        TextInput::make('spec_name')
                                            ->label('Tên thông số (VD: Chất liệu)')
                                            ->required(),
                                        
                                        TextInput::make('spec_value')
                                            ->label('Giá trị (VD: 100% Cotton)')
                                            ->required(),
                                    ])
                                    ->columns(2)
                            ]),
                    ])->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images.image_url')
                    ->label('Ảnh')
                    ->circular()
                    ->stacked()
                    ->limit(3),
                    
                Tables\Columns\TextColumn::make('product_name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                Tables\Columns\TextColumn::make('base_sku')
                    ->label('SKU')
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('base_price')
                    ->label('Giá')
                    ->money('USD')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('categories.category_name')
                    ->label('Danh mục')
                    ->badge(),

                Tables\Columns\IconColumn::make('is_customizable')
                    ->boolean(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    
    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
