interface IWeatherDto {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
}

export interface IWeatherForecastDto {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: IWeatherDto
  daily: Array<
    Omit<IWeatherDto, 'temp' | 'feels_like' | 'visibility'> & {
      moonrise: number
      moonset: number
      moon_phase: number
      summary: string
      temp: {
        day: number
        min: number
        max: number
        night: number
        eve: number
        morn: number
      }
      feels_like: {
        day: number
        night: number
        eve: number
        morn: number
      }
      pop: number
    }
  >
}

export interface IPhotoResponseDto {
  Altitude: number
  CameraID: number
  CameraMake: string
  CameraModel: string
  CameraSerial: string
  CameraSrc: string
  CameraType: string
  Caption: string
  CellAccuracy: number
  CellID: string
  CheckedAt: string
  Color: number
  Country: string
  CreatedAt: string
  Day: number
  DeletedAt: string
  DocumentID: string
  Duration: number
  EditedAt: string
  Exposure: string
  FNumber: number
  Faces: number
  Favorite: boolean
  FileName: string
  FileRoot: string
  FileUID: string
  Files?: Array<{
    AspectRatio: number
    Chroma: number
    Codec: string
    ColorProfile: string
    Colors: string
    CreatedAt: string
    CreatedIn: number
    DeletedAt: string
    Diff: number
    Duration: number
    Error: string
    FPS: number
    FileType: string
    Frames: number
    HDR: boolean
    Hash: string
    Height: number
    InstanceID: string
    Luminance: string
    MainColor: string
    MediaID: string
    MediaType: string
    MediaUTC: number
    Mime: string
    Missing: boolean
    ModTime: number
    Name: string
    Orientation: number
    OrientationSrc: string
    OriginalName: string
    Pages: number
    PhotoUID: string
    Portrait: boolean
    Primary: boolean
    Projection: string
    PublishedAt: string
    Root: string
    Sidecar: boolean
    Size: number
    Software: string
    TakenAt: string
    TimeIndex: string
    UID: string
    UpdatedAt: string
    UpdatedIn: number
    Video: boolean
    Watermark: boolean
    Width: number
  }>
  FocalLength: number
  Hash: string
  Height: number
  ID: string
  InstanceID: string
  Iso: number
  Lat: number
  LensID: number
  LensMake: string
  LensModel: string
  Lng: number
  Merged: boolean
  Month: number
  Name: string
  OriginalName: string
  Panorama: boolean
  Path: string
  PlaceCity: string
  PlaceCountry: string
  PlaceID: string
  PlaceLabel: string
  PlaceSrc: string
  PlaceState: string
  Portrait: boolean
  Private: boolean
  Quality: number
  Resolution: number
  Scan: boolean
  Stack: number
  TakenAt: string
  TakenAtLocal: string
  TakenSrc: string
  TimeZone: string
  Title: string
  Type: string
  TypeSrc: string
  UID: string
  UpdatedAt: string
  Width: number
  Year: number
}

export interface IImmichAsset {
  id: string
  deviceAssetId: string
  ownerId: string
  deviceId: string
  type: 'IMAGE' | 'VIDEO'
  originalPath: string
  resizePath: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  mimeType: string
  duration: string
  webpPath: string
  encodedVideoPath: string
}

export interface IImmichAlbum {
  albumName: string
  description: string
  id: string
  ownerId: string
  albumThumbnailAssetId: string
  createdAt: string
  updatedAt: string
  assetCount: number
  owner: {
    id: string
    email: string
    name: string
  }
  assets: IImmichAsset[]
  hasSharedLink: boolean
}
